# STATUS — 2026-06-14 작업 (SEO 패턴 적용)

> n2nib·cargoinsu 상품페이지 SEO 패턴 일괄 적용 — GSC 분석 상위 검색어 9개 페이지.
> 내일 세션 시작 시 이 문서를 첨부하세요.

---

## 1. 오늘 작업 개요

GSC 실적 분석(n2nib 3개월: 클릭86/노출2,060/순위12.2 · cargoinsu: 클릭17/노출408/순위8)에서
**노출은 있는데 클릭이 약한 상위 검색어** 페이지에 SEO 패턴을 적용. 페이지 신규생성이 아니라
이미 있는 페이지의 **랭킹·CTR 개선**이 핵심이라는 진단에 따름.

### SEO 패턴 = 3가지 묶음
1. **제목/메타 intent-match** — 검색어 의도에 맞춰 title·description(+있으면 og/twitter) 보강.
   이미 충분하면 무수정.
2. **JSON-LD 스키마 3종** — BreadcrumbList + Article + FAQPage.
   (※ FAQPage는 페이지에 보이는 FAQ와 1:1 일치해야 함 — 가시 콘텐츠 그대로 추출)
3. **FAQ 섹션** — 없으면 신설(4문항), 있으면 그대로 스키마화.
4. 배포 → **GSC URL검사 > 색인 생성 요청** → 4주 뒤 클릭 변화 측정.

---

## 2. 페이지별 상태 (총 9페이지)

| # | 페이지 | 사이트 | 검색어 | 한 일 | 배포/색인 |
|---|---|---|---|---|---|
| 1 | `liability-vasp` (VASP 수탁) | n2nib | vasp 수탁 | 제목 보강 + 스키마3 | ✅ 완료 (커밋 bd5a3b6) |
| 2 | `liability-freight-forwarders` (FFL 포워더) | cargoinsu | 포워더·FFL | 제목 보강 + FAQ신설 + 스키마3 | ✅ 완료 (커밋 9c0c1df) |
| 3 | `liability-eo` (E&O) | n2nib | e&o | 제목·메타·og·twitter + 스키마3 | ⏳ **배포 대기** |
| 4 | `marine-transit` (운송보험/일반) | cargoinsu | inland transit insurance | 제목·메타 + FAQ신설 + 스키마3 | ⏳ **배포 대기** |
| 5 | `inland-transit` (내륙운송/FOB) | cargoinsu | FOB 수출 내륙 | FOB 차별화 + FAQ신설 + 스키마3 | ✅ 배포완료 · 색인요청함 |
| 6 | `liability-accountant` (회계세무사) | n2nib | 세무사 보험 | 메타·og·twitter + 스키마3 | ⏳ **배포 대기** |
| 7 | `liability-academy` (학원배상) | n2nib | 학원배상책임보험 | 메타·og·twitter + 스키마3 | ⏳ **배포 대기** |
| 8 | `specialty-holeinone` (홀인원) | n2nib | 홀인원 | 메타·og·twitter + 스키마2(기존FAQPage유지) | ⏳ **배포 대기** |
| 9 | `marine-cargo` (적하보험) | cargoinsu | 적하보험·marine cargo insurance | 스키마3만(제목·메타 무수정) | ⏳ **배포 대기** |

---

## 3. 내일 할 일 — 미배포 6개 푸시 + GSC 색인 요청

각 스크립트는 **반드시 파일로 실행** (라인 붙여넣기 ✗ — `if/else` 깨짐).
파일을 Downloads에 받은 뒤 cmd/PowerShell에서:

```
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\배포_n2nib_eo_SEO.ps1"
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\배포_n2nib_accountant_SEO.ps1"
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\배포_n2nib_academy_SEO.ps1"
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\배포_n2nib_holeinone_SEO.ps1"
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\배포_cargo_marinetransit_SEO.ps1"
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\배포_cargo_marinecargo_SEO.ps1"
```

푸시 후(1~2분 반영), **각 사이트 GSC 속성에서** URL 검사 → 색인 생성 요청:

**n2nib.com 속성:**
```
https://n2nib.com/products/liability-eo
https://n2nib.com/products/liability-accountant
https://n2nib.com/products/liability-academy
https://n2nib.com/products/specialty-holeinone
```

**cargoinsu.com 속성:**
```
https://cargoinsu.com/products/marine-transit.html
https://cargoinsu.com/products/marine-cargo.html
```

> 주소 형식 주의: **n2nib = `.html` 없는 깔끔한 URL**, **cargoinsu = `.html` 포함**이 정식.

---

## 4. 출력 파일 (Downloads에 받아둘 것)

HTML 6개 + 배포 스크립트 6개:

| HTML | 스크립트 | 레포 경로 |
|---|---|---|
| liability-eo.html | 배포_n2nib_eo_SEO.ps1 | n2nib\products\ |
| liability-accountant.html | 배포_n2nib_accountant_SEO.ps1 | n2nib\products\ |
| liability-academy.html | 배포_n2nib_academy_SEO.ps1 | n2nib\products\ |
| specialty-holeinone.html | 배포_n2nib_holeinone_SEO.ps1 | n2nib\products\ |
| marine-transit.html | 배포_cargo_marinetransit_SEO.ps1 | cargoinsu\products\ |
| marine-cargo.html | 배포_cargo_marinecargo_SEO.ps1 | cargoinsu\products\ |

(이미 배포된 inland-transit / vasp / FFL은 재배포 불필요)

---

## 5. 기술 메모 / 이번에 배운 점

- **바이트 안전 필수.** cargoinsu HTML은 모두 0x90 바이트 포함·BOM 없음 / n2nib HTML은 BOM + 0x90.
  모든 편집은 Python 바이트 단위(`data.replace(old.encode(), new.encode())`)로만 처리. CSS(`assets/styles.css`)는 **건드리지 않음**.
- **스크립트 검증 마커:** 보통 `application/ld+json`. 단 **홀인원은 기존 FAQPage가 이미 있어** 마커를
  `BreadcrumbList`로 잡음(신·구 구분 위해).
- **빌드 전 반드시 기존 스키마 수 확인할 것.** 홀인원에서 기존 FAQPage를 못 보고 FAQPage를 또 넣어
  중복 발생 → 재빌드로 Breadcrumb·Article 2종만 추가해 해결. **앞으로 매핑 단계에서 `grep -c application/ld+json` 필수.**
- FAQPage 스키마 텍스트는 페이지에 보이는 FAQ와 글자까지 일치해야 함(구글 요건). 적하보험은
  페이지의 `faq-q/faq-a` 8문항을 그대로 추출.
- **참고:** 구글 FAQ 리치결과는 2026-05-07부로 SERP 노출 중단. 그래도 FAQPage는 AI검색·Bing·Perplexity에서
  유효하고 콘텐츠 신호로 작동하므로 유지. BreadcrumbList 리치결과는 정상 작동.

---

## 6. 카니발 이슈 해소 (운송보험 vs 내륙운송보험)

cargoinsu의 두 페이지가 "Inland Transit"을 동시에 물어 신호 분산 → **통합(301) 아니라 차별화로 정리:**

- **marine-transit "운송보험"** = 일반 국내 운송(자가용·위탁·단건·연간, 화주 측). 영문 "inland transit insurance" 검색어가 실제로 잡히는 쪽 → 그대로 강화.
- **inland-transit "내륙운송보험"** = **FOB 수출 공장→선적항(POL) 구간**(매수인 적하보험 부착 전 공백 담보) 니치로 재포지셔닝. FAQ 맨 앞을 FOB 질문으로.

→ 두 페이지가 서로 다른 검색어를 잡도록 분리 완료.

---

## 7. 다음 단계 (배포 이후)

- [ ] 미배포 6개 푸시 + GSC 색인 요청 (위 3·4절)
- [ ] inland-transit "발견됨-색인 안 됨" 상태 → 색인 요청 후 며칠 내 색인 확인
- [ ] **4주 뒤 GSC 측정** — 9개 페이지의 타깃 검색어 클릭/노출/순위 변화
- [ ] (선택) 패턴을 나머지 n2nib 페이지로 확장 — GSC 노출 상위 검색어 추가 발굴
- [ ] (선택) 미배포분 **사이트별 통합 배포 스크립트**(n2nib 4 / cargoinsu 2)로 묶기 — 요청 시 제작

---

### 컴플라이언스 (전 페이지 공통 — 유지됨)
6개사 가나다순(AIG·Chubb·DB손해보험·KB손해보험·메리츠화재·현대해상) · "인수심사 후 확정" ·
우열/최저가 단정 없음 · 작성자 E-E-A-T(성한욱·기업보험심사역 ACIU·등록 제2026-012201호) ·
푸터 금감원 등록번호.
