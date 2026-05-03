# n2nib.com 배포 가이드 (Cloudflare Pages)

**작성일:** 2026-05-02 (111종 사이트 반영 + 카카오 통합)
**대상:** 엔투엔보험중개 (N2N Insurance Brokerage)
**도메인:** n2nib.com (Squarespace 등록)
**배포 플랫폼:** Cloudflare Pages (무료, HTTPS 자동, 한국 CDN)
**예상 작업시간:** 처음 1회 60~90분, 이후 업데이트 5분
**현재 사이트 규모:** 118개 HTML (Top 8 + 상품상세 110) + 자산 (CSS·JS·SVG·인덱스) — 카탈로그 112종 중 111종 노출 (보증 상품 2종 제외)

---

## 📋 전체 흐름

```
[1] Cloudflare 계정
 └→ [2] Pages 프로젝트 (ZIP 또는 GitHub 업로드)
      └→ [3] 임시 URL 동작 확인 (n2nib.pages.dev)
           └→ [4] DNS를 Cloudflare로 이관 (Squarespace nameserver 변경)
                └→ [5] Custom Domain 연결 (n2nib.com / www.n2nib.com)
                     └→ [6] HTTPS 자동 / 카카오 채널 ID 교체 / 폼 연동 → 완료
```

---

## 🗂 현재 사이트 구성 (배포 직전 점검)

```
홈페이지/                                  ← Cloudflare Pages 루트
├── index.html              (홈 + WHY + 빠른 진입 + 사례)
├── about.html              (회사소개 · 보험중개사 정의 · 비교표)
├── products.html           (111종 카탈로그 + 인라인 필터)
├── consult.html            (상담폼 + URL 파라미터 자동 채움 + 카카오 카드)
├── search.html             (전용 검색 페이지)
├── industries.html         (10개 업종 허브)
├── duty.html               (10종 법정 의무보험 일람)
├── risk-checklist.html     (5분 위험 자가진단)
│
├── assets/
│   ├── styles.css          (3,500줄 — vape24 + 메가메뉴 + 카카오 + 필터)
│   ├── script.js           (탭·메뉴 토글 등 일반 JS)
│   ├── search.js           (클라이언트 사이드 검색 엔진)
│   ├── products-index.json (111종 메타데이터)
│   ├── products-index.js   (file:// 호환용 JS 변환본 — 자동 생성)
│   └── n2n-logo.svg        (3-디스크 N2N 로고)
│
├── products/               (111개 상품 상세페이지)
│   ├── marine-cargo.html
│   ├── liability-pl.html
│   ├── property-temple.html (사찰종합 · 신규)
│   └── ... (111종)
│
├── DEPLOY.md               (본 문서)
├── KAKAO_SETUP.md          (카카오 채널 개설 가이드)
└── README.md
```

---

## Step 0 · 배포 직전 체크리스트

- [ ] 카카오 채널 ID 결정 → `KAKAO_SETUP.md` 참고
- [ ] Formspree 계정 가입 → 폼 ID 발급 (https://formspree.io)
- [ ] consult.html의 `REPLACE_WITH_YOUR_FORMSPREE_ID` 치환
- [ ] 카카오 placeholder `_xxxxxx` 치환 (또는 배포 후)
- [ ] 로컬 브라우저에서 모든 GNB 메뉴·검색·필터·상담폼 동작 확인

---

## Step 1 · Cloudflare 계정 생성 (5분)

1. https://dash.cloudflare.com/sign-up
2. 이메일(`hanwook.seong@n2nib.com`)로 가입
3. 이메일 인증 완료
4. 무료 요금제(Free Plan) — 결제수단 등록 불요

---

## Step 2 · Cloudflare Pages 프로젝트 (15분)

### 2-1. 프로젝트 생성
1. 좌측 메뉴 → **Workers & Pages**
2. **Create application** → **Pages** 탭 → **Upload assets**
3. 프로젝트 이름: `n2nib`
4. **Create project** 클릭

### 2-2. 파일 업로드 (방식 A: ZIP)

**중요:** ZIP 파일 안에 **상위 폴더 없이** 바로 `index.html`이 루트에 위치해야 합니다.

PowerShell로 정확히 압축하기:
```powershell
cd "C:\Users\hanwo\OneDrive\A A_N2NIB_엔투엔보험중개\원수사\N2N보험중개취급상품카탈로그\홈페이지"
Compress-Archive -Path .\* -DestinationPath ..\n2nib_deploy.zip -Force
```

또는 Windows 탐색기에서:
- `홈페이지` 폴더 더블클릭 → 안으로 들어가서 → 모든 파일/폴더 선택 (Ctrl+A) → 우클릭 → **압축(ZIP) 폴더로 보내기**
- 폴더 자체를 압축하면 안 됨 (안에 `홈페이지/index.html`이 되어 버림)

업로드:
1. Cloudflare Pages 업로드 영역에 ZIP 드래그앤드롭
2. **Deploy site** 클릭
3. 30~60초 후 임시 URL 발급 (`n2nib.pages.dev`)

### 2-3. 동작 확인 (임시 URL)
- ✅ 메인 페이지 정상 표시
- ✅ GNB 메가메뉴 6 카테고리 호버 시 111종 모두 노출
- ✅ products.html 인라인 필터 (검색·카테고리·의무) 동작
- ✅ search.html 키워드 검색 (예: "사찰", "예술품", "임상시험")
- ✅ industries.html 10업종 허브 → 상품 페이지 점프
- ✅ duty.html 10종 의무보험 표
- ✅ risk-checklist.html 5분 자가진단 → 결과 표시 → consult 자동 채움
- ✅ 모바일 반응형 확인

> ⚠ 문제 발견 시 이 단계에서 수정 후 재업로드. 도메인 연결 전에 점검 완료.

---

## Step 3 · 도메인 DNS 이관 (15~30분, 전파 최대 24h)

### 3-1. Squarespace 확인
1. https://account.squarespace.com/domains
2. **n2nib.com** 도메인 관리 진입
3. **Advanced Settings** 또는 **Nameservers**

### 3-2. Cloudflare에 도메인 추가
1. Cloudflare 대시보드 → **Add a site**
2. `n2nib.com` 입력 → **Continue**
3. **Free Plan** 선택
4. DNS 레코드 자동 스캔 (1분)
5. Cloudflare가 제공하는 **Nameserver 2개** 복사 (예시: `abel.ns.cloudflare.com`, `dana.ns.cloudflare.com`)

### 3-3. Squarespace에서 Nameserver 교체
1. 기존 Nameserver를 Cloudflare 2개로 **교체**
2. 저장

### 3-4. DNS 전파 대기
- 통상 5분~2시간
- 최대 24~48시간
- Cloudflare 대시보드에서 도메인 **Active** 상태 확인

---

## Step 4 · Custom Domain 연결 (5분)

DNS 전파 완료 후:
1. Cloudflare Workers & Pages → `n2nib` 프로젝트 → **Custom domains**
2. **Set up a custom domain** → `n2nib.com` 입력 → **Continue**
3. `www.n2nib.com`도 추가 (권장)
4. **Activate domain**
5. SSL 자동 발급 (Let's Encrypt) — 수초~수분

### Step 4-1. www → root 리다이렉트
- Cloudflare Rules → **Page Rules** 또는 **Bulk Redirects**
- `www.n2nib.com/*` → `https://n2nib.com/$1` (301 redirect)

---

## Step 5 · 카카오 채널 ID 교체 (5분)

배포 후 카카오 채널을 만들었다면 placeholder를 일괄 교체합니다. 자세한 절차는 [`KAKAO_SETUP.md`](KAKAO_SETUP.md) 참고.

PowerShell 일괄 교체:
```powershell
cd "C:\Users\hanwo\OneDrive\A A_N2NIB_엔투엔보험중개\원수사\N2N보험중개취급상품카탈로그\홈페이지"
Get-ChildItem -Recurse -Include *.html | ForEach-Object {
  (Get-Content $_.FullName -Raw -Encoding UTF8) -replace 'pf\.kakao\.com/_xxxxxx', 'pf.kakao.com/_n2nib' |
    Set-Content $_.FullName -NoNewline -Encoding UTF8
}
```

교체 후 `Compress-Archive`로 ZIP 재생성 → Cloudflare Pages **Create deployment**로 재업로드.

---

## Step 6 · 상담신청 폼 백엔드 연동 (10분)

`consult.html`의 `action="https://formspree.io/f/REPLACE_WITH_YOUR_FORMSPREE_ID"`를 실제 ID로 교체합니다.

### 6-1. Formspree 가입 (무료 50건/월)
1. https://formspree.io/register
2. `hanwook.seong@n2nib.com`로 가입
3. **New Form** → 이름: `N2N Consult`
4. 발급된 Form ID(예: `xeqyabcd`) 복사

### 6-2. consult.html 교체
```powershell
cd "C:\Users\hanwo\OneDrive\A A_N2NIB_엔투엔보험중개\원수사\N2N보험중개취급상품카탈로그\홈페이지"
(Get-Content consult.html -Raw -Encoding UTF8) -replace 'REPLACE_WITH_YOUR_FORMSPREE_ID', 'xeqyabcd' |
  Set-Content consult.html -NoNewline -Encoding UTF8
```

### 6-3. 테스트
- consult.html 열기 → 폼 작성 → 제출 → `hanwook.seong@n2nib.com`에 메일 도착 확인
- 첫 제출 시 Formspree 인증 메일 클릭 필요

---

## Step 7 · 최종 점검

- [ ] https://n2nib.com 접속 → 메인페이지 정상
- [ ] https://www.n2nib.com → https://n2nib.com 리다이렉트
- [ ] SSL 자물쇠 확인 (HTTPS)
- [ ] 111개 상품 상세페이지 무작위 5개 접근 가능
- [ ] GNB 메가메뉴 (모든 카테고리 호버 → 컬럼 그리드 정상)
- [ ] 검색 키워드 5개 (사찰·예술품·임상시험·드론·승강기) 결과 정상
- [ ] 5분 자가진단 → 결과 표시 → 상담신청 자동 채움
- [ ] 카카오 1:1 상담 클릭 → 카카오톡 채널 정상 진입
- [ ] 상담폼 제출 → 이메일 수신
- [ ] 모바일 반응형 확인 (메가메뉴 collapse)
- [ ] 푸터 사업자번호·주소·전화·이메일 노출
- [ ] Google · Naver · 카카오에 사이트 등록

---

## 🚀 이후 업데이트 (배포 v2~)

### 방식 A. 수동 ZIP 재업로드
1. 로컬 `홈페이지` 폴더 수�