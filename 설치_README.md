# 프롬프트 서랍 · 설치 가이드 (GitHub Pages + Supabase)

키를 넣기 전에도 `index.html`을 더블클릭하면 **로컬 모드**로 바로 써볼 수 있어요.
아래는 클라우드(영구 저장·여러 기기 동기화)로 올리는 방법입니다.

---

## 1. Supabase (데이터 저장소)

1. https://supabase.com 에서 **New project** 생성 (무료).
2. 좌측 **SQL Editor** → 새 쿼리 → `schema.sql` 내용을 붙여넣고 **Run**.
3. 좌측 **Project Settings → API** 이동.
   - **Project URL** 복사
   - **anon public** 키 복사
4. `config.js` 파일을 열어 두 값을 붙여넣고 저장:
   ```js
   window.SUPABASE_URL = "https://xxxx.supabase.co";
   window.SUPABASE_ANON_KEY = "eyJhbGci...";
   ```

> ⚠️ anon 키는 원래 '공개용' 키예요(클라이언트에 넣는 게 정상). 보안은 schema.sql의
> RLS 정책이 담당합니다. 비공개/다중 사용자가 필요해지면 Auth 로그인 방식으로 바꾸면 됩니다.

---

## 2. GitHub Pages (고정 주소 · 만료 없음)

1. GitHub에서 **새 repository** 생성 (Public).
2. 이 폴더의 파일 전부 업로드/푸시:
   `index.html`, `config.js`, `sw.js`, `manifest.webmanifest`,
   `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
   (schema.sql, 이 파일은 올려도 그만 안 올려도 그만)
3. repository **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main / (root)** → **Save**
4. 1~2분 뒤 주소 생성: `https://<아이디>.github.io/<repo>/`

---

## 3. 앱처럼 설치 (선택)

- 위 주소를 **Chrome/Edge**로 열기 →
- 주소창 오른쪽 **설치 아이콘**(모니터+화살표), 또는 메뉴(⋮ / ⋯) → **"앱으로 설치 / Install"**
- → 주소창 없는 **단독 창**으로 뜨고 시작메뉴·작업표시줄 아이콘 생성.

---

## 동작 메모
- 우상단에 **"동기화됨"** 표시가 뜨면 클라우드 연결 성공.
- 저장 내용은 Supabase에 영구 보관 → 브라우저를 지워도, 다른 기기에서도 그대로.
- 오프라인이어도 마지막으로 본 목록은 표시되고, 온라인 되면 다시 동기화됩니다.
- 클립보드 자동 추가는 https 주소(배포본)에서 권한 한 번 허용하면 매끄럽게 동작.

## 업데이트 방법
- 코드가 바뀌면 GitHub repo의 파일만 교체(푸시)하면 사이트가 갱신됩니다.
