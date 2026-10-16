# Wishwell 실제 운영 연결 키트 (PayPal + Supabase + Vercel)

기존 Wishwell 디자인을 유지하고, 결제 검증/공용 게시판/음성 저장을 연결할 수 있도록 만든 배포용 프로젝트입니다. **계정 키를 넣고 배포하기 전에는 실제 서비스로 작동하지 않습니다.** 이 채팅에서 PayPal·Supabase 계정에 로그인하거나 결제 정보를 대신 설정할 수는 없습니다.

## 구성
- `index.html` — 기존 디자인 + PayPal 결제 버튼 + 결제 후 소원 게시
- `wishwell-config.js` — 브라우저에 노출되어도 되는 PayPal Client ID, Supabase URL/anon key
- `api/paypal/create-order.js` — 서버에서 $0.99 주문 생성
- `api/paypal/capture-order.js` — PayPal 서버 API로 결제 상태/금액 검증
- `api/wishes.js` — 공용 소원 읽기, 검증된 결제 1건당 게시 1개, 음성 업로드
- `supabase-schema.sql` — DB/RLS/음성 저장 버킷 설정
- `vercel.json`, `package.json` — 배포 설정

## 1) Supabase 설정
1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase-schema.sql` 전체를 실행합니다.
3. Project Settings → API에서 Project URL과 `anon`/publishable key를 복사합니다.
4. `wishwell-config.js`의 `supabaseUrl`, `supabaseAnonKey`에 입력합니다.
5. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`는 Vercel 환경변수에만 넣습니다. Service Role Key를 `wishwell-config.js`나 HTML에 넣지 마세요.

## 2) PayPal 설정
1. PayPal Developer Dashboard에서 앱을 만들고 Client ID와 Secret을 가져옵니다.
2. 먼저 Sandbox 테스트 앱으로 테스트합니다. Sandbox 사용 시 Vercel 환경변수 `PAYPAL_API_BASE`를 `https://api-m.sandbox.paypal.com`으로 설정합니다.
3. Vercel 환경변수에 `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`을 넣습니다.
4. `wishwell-config.js`의 `paypalClientId`에는 같은 앱의 Client ID를 넣습니다.
5. 실제 결제 테스트 전 Sandbox로 주문 생성 → 승인 → 캡처 → 게시까지 확인합니다. 실서비스로 바꿀 때 `PAYPAL_API_BASE`를 제거하거나 `https://api-m.paypal.com`으로 설정하고, 실제 결제 Client ID/Secret을 넣습니다.

## 3) Vercel 배포
1. 이 폴더를 GitHub 저장소로 올립니다.
2. Vercel에서 해당 저장소를 Import합니다.
3. Project Settings → Environment Variables에 아래 값을 추가합니다.
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYPAL_API_BASE` (Sandbox 테스트 때만 `https://api-m.sandbox.paypal.com`)
4. `wishwell-config.js`에 브라우저용 설정을 입력하고 다시 배포합니다.
5. 배포 URL을 휴대폰에서 열어 테스트합니다.

## 보안/출시 전 체크
- `SUPABASE_SERVICE_ROLE_KEY`와 `PAYPAL_CLIENT_SECRET`은 절대 공개하지 않습니다.
- PayPal 수수료, 국가별 결제 가능 여부, 사업자/세금/환불 의무를 확인하세요. $0.99 소액 결제는 고정 수수료 비중이 클 수 있습니다.
- 개인정보 처리방침, 이용약관, 신고/삭제 요청 절차를 게시하기 전 준비하세요.
- 음성은 공개 게시물입니다. 이용자에게 공개 저장임을 명확히 알리고, 삭제 정책을 마련하세요.
- 현재 하트 버튼은 UI에서만 수치가 바뀌며 서버 저장은 아직 연결되지 않았습니다.
- 음성 업로드 실패 시 고아 파일이 남을 수 있으므로 운영 전 스토리지 정리 정책을 추가하세요.
- 초기 데모 소원은 코드 안에 표시되지만 서버에 있는 실제 소원은 저장된 소원만 표시됩니다.
