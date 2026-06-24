-- ============================================================
--  프롬프트 서랍 · Supabase 스키마
--  Supabase 대시보드 → SQL Editor 에 붙여넣고 [Run]
-- ============================================================

create table if not exists public.words (
  id          text primary key,
  en          text not null,
  ko          text default '',
  cat         text default '기타',
  count       integer default 0,
  created_at  timestamptz default now()
);

-- 같은 단어(대소문자 무시) 중복 방지
create unique index if not exists words_en_lower_idx on public.words (lower(en));

-- RLS(행 보안) 켜기
alter table public.words enable row level security;

-- 개인용: anon 키로 읽기/쓰기 허용.
--  ⚠️ 주의: GitHub Pages 사이트는 공개라서 anon 키도 공개됩니다.
--     데이터 자체는 민감하지 않지만, 비공개/다중 사용자가 필요해지면
--     이 정책 대신 Supabase Auth(로그인) + 사용자별 정책으로 바꾸세요.
drop policy if exists "anon full access" on public.words;
create policy "anon full access" on public.words
  for all
  to anon
  using (true)
  with check (true);
