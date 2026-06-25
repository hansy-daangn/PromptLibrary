// ============================================================
//  프롬프트 서랍 · 번역 Edge Function (Claude 프록시)
//
//  영어 이미지-프롬프트 키워드를 한국어로 번역해 돌려줍니다.
//  API 키는 서버(Supabase secret)에만 두고 브라우저에는 노출하지 않습니다.
//
//  배포 (레포 루트에서, Supabase CLI 필요):
//    supabase login
//    supabase link --project-ref dpjnvtmymwnqclkjmejb
//    supabase functions deploy translate
//  Claude API 키 설정(서버 시크릿):
//    supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const { words } = await req.json().catch(() => ({ words: [] }));
    const list: string[] = Array.isArray(words)
      ? words.map((w) => String(w || "").trim()).filter(Boolean).slice(0, 80)
      : [];
    if (!list.length) return json({ translations: {} });

    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) return json({ error: "ANTHROPIC_API_KEY not set" }, 500);

    const prompt =
      "다음 영어 이미지 생성 프롬프트 키워드들을 자연스러운 한국어로 번역해줘. " +
      "각 항목은 의미 단위로 짧게 번역하고, 프롬프트 맥락(인물·배경·조명·스타일·카메라 등)을 고려해. " +
      "반드시 JSON 객체 하나로만 답해. key는 입력한 영어 원문 그대로, value는 한국어 번역.\n\n" +
      JSON.stringify(list);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return json({ error: "anthropic " + r.status, detail: errText }, 502);
    }

    const data = await r.json();
    const txt: string = data?.content?.[0]?.text ?? "{}";
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
