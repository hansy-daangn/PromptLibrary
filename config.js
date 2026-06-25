// ───────────────────────────────────────────────
//  Supabase 연결 설정
//  대시보드 → Project Settings → API 에서 복사해 붙여넣으세요.
//  (이 두 값을 채우기 전까지는 '로컬 모드'로만 동작합니다)
// ───────────────────────────────────────────────
window.SUPABASE_URL = "https://dpjnvtmymwnqclkjmejb.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwam52dG15bXducWNsa2ptZWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzc2MDcsImV4cCI6MjA5Nzg1MzYwN30.DMmMmxgnAZceaqSgPfsIZ1ZSk8Ih7lbaDtmQnoLT4as";

// ───────────────────────────────────────────────
//  AI 번역(사전에 없는 단어) — Supabase Edge Function 이름
//  supabase/functions/translate 를 배포하고 ANTHROPIC_API_KEY 시크릿을 설정하면
//  '번역하기'가 사전에 없는 단어를 Claude로 번역해 바로 반영합니다.
// ───────────────────────────────────────────────
window.TRANSLATE_FN = "translate";
