// ============================================================
//  프롬프트 서랍 · 번역 Edge Function (Gemini 프록시)
//
//  영어 이미지-프롬프트 키워드를 한국어로 번역해 돌려줍니다.
//  API 키는 서버(Supabase secret)에만 두고 브라우저에는 노출하지 않습니다.
//
//  배포 (대시보드 Edge Functions → Deploy a new function → Via Editor,
//        또는 CLI: supabase functions deploy translate)
//  Gemini API 키 설정(서버 시크릿):
//    - 무료 발급: https://aistudio.google.com  (결제 불필요)
//    - 대시보드 Edge Functions → Secrets → GEMINI_API_KEY = AIza...
//      (또는 CLI: supabase secrets set GEMINI_API_KEY=AIza...)
//  호출(브라우저): sb.functions.invoke("translate", { body: { words: [...] } })
//  응답: { translations: { "<영어원문>": "<한국어>" , ... } }
//
//  참고: 기본 verify_jwt=true 로 배포해도 사이트가 anon 키로 호출하므로 통과됩니다.
// ============================================================

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

const MODEL = "gemini-2.5-flash";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const { words } = await req.json().catch(() => ({ words: [] }));
    const list: string[] = Array.isArray(words)
      ? words.map((w) => String(w || "").trim()).filter(Boolean).slice(0, 80)
      : [];
    if (!list.length) return json({ translations: {} });

    // 새 시크릿 이름(GEMINI_API_KEY) 우선, 예전 이름(ANTHROPIC_API_KEY)도 호환
    const key = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("GOOGLE_API_KEY");
    if (!key) return json({ error: "GEMINI_API_KEY not set" }, 500);

    const prompt =
      "다음 영어 영상/이미지 생성 프롬프트 키워드들을 자연스러운 한국어로 번역해줘.\n" +
      "번역 규칙:\n" +
      "1. 영상·이미지 생성 프롬프트라는 점을 고려해, 프롬프트 맥락(인물·배경·조명·스타일·카메라·동작 등)에 맞게 번역해.\n" +
      "2. 각 항목은 의미 단위로 짧고 간결하게 번역해. 군더더기 없이 핵심만 담아.\n" +
      "3. 'no ~', 'without ~' 처럼 무언가를 배제·금지하는 표현은 '없음', '아님' 으로 풀어쓰지 말고 '~ 금지' 형식으로 번역해. " +
      "(예: 'no text' → '텍스트 금지', 'no blur' → '블러 금지')\n" +
      "4. 단, 'north' 처럼 띄어쓰기 없이 한 단어로 붙어 있는 경우는 3번 규칙을 적용하지 말고 단어 본래 뜻으로 번역해.\n" +
      "반드시 JSON 객체 하나로만 답해. key는 입력한 영어 원문 그대로, value는 한국어 번역.\n\n" +
      JSON.stringify(list);

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      MODEL +
      ":generateContent?key=" +
      encodeURIComponent(key);

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return json({ error: "gemini " + r.status, detail: errText }, 502);
    }

    const data = await r.json();
    const txt: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p?.text || "").join("") ??
      "{}";
    let translations: Record<string, string> = {};
    try {
      const m = txt.match(/\{[\s\S]*\}/);
      translations = m ? JSON.parse(m[0]) : {};
    } catch (_) {
      translations = {};
    }
    return json({ translations });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
