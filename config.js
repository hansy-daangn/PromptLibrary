// ───────────────────────────────────────────────
//  Supabase 연결 설정
//  대시보드 → Project Settings → API 에서 복사해 붙여넣으세요.
//  (이 두 값을 채우기 전까지는 '로컬 모드'로만 동작합니다)
// ───────────────────────────────────────────────
window.SUPABASE_URL = "https://dpjnvtmymwnqclkjmejb.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwam52dG15bXducWNsa2ptZWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzc2MDcsImV4cCI6MjA5Nzg1MzYwN30.DMmMmxgnAZceaqSgPfsIZ1ZSk8Ih7lbaDtmQnoLT4as";

// ───────────────────────────────────────────────
//  AI 번역(사전에 없는 단어) — Gemini 프록시 Edge Function
//  번역 함수는 데이터와 무관한 무상태 프록시라, 단어 DB와 다른
//  Supabase 프로젝트에 올려도 됩니다. 아래 URL/KEY 로 직접 호출합니다.
//  (TRANSLATE_URL 이 비어 있으면 SUPABASE 프로젝트의 함수를 사용)
// ───────────────────────────────────────────────
window.TRANSLATE_FN = "translate";
window.TRANSLATE_URL = "https://newoydegfbnnqujgiips.supabase.co/functions/v1/translate";
window.TRANSLATE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ld295ZGVnZmJubnF1amdpaXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzgzOTIsImV4cCI6MjA5MTgxNDM5Mn0.NFTJeC1fHuYwodu1uoAVY7qr4P_KV1NbvXUyYNE3I8g";
