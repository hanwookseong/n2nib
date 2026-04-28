@echo off
REM ============================================================
REM  N2N 엔투엔보험중개 - 현대해상 약관 PDF 배포 스크립트 v2
REM  현대해상 43종 (기존 15 + 잔여 28) 상품 약관을 복사합니다.
REM ============================================================

SETLOCAL EnableDelayedExpansion
CHCP 65001 >NUL

SET "SRC=C:\Users\hanwo\OneDrive\A A_N2NIB_엔투엔보험중개\원수사\현대해상\약관"
SET "DST=C:\Users\hanwo\OneDrive\A A_N2NIB_엔투엔보험중개\원수사\N2N보험중개취급상품카탈로그\홈페이지\assets\brochures\hyundai"

IF NOT EXIST "%DST%" MKDIR "%DST%"

ECHO.
ECHO =================================================================
ECHO 현대해상 약관 PDF 배포 시작 (43종)
ECHO SRC = %SRC%
ECHO DST = %DST%
ECHO =================================================================

REM --- 기존 15종 ---
CALL :COPY "20260101_하이기업종합플러스보험-내지.pdf"                                      "hy-enterprise-plus-2026.pdf"
CALL :COPY "03.약관_20250901_부동산권리보험(임차권용)1.pdf"                                 "hy-title-lease-2025.pdf"
CALL :COPY "03.약관_20250901_부동산권리보험(저당권용).pdf"                                  "hy-title-mortgage-1-2025.pdf"
CALL :COPY "03.약관_20250901_부동산권리보험(저당권용II).pdf"                                "hy-title-mortgage-2-2025.pdf"
CALL :COPY "03.약관_20250901_부동산권리보험(전세자금대출용II)1.pdf"                          "hy-title-jeonse-2-2025.pdf"
CALL :COPY "03.약관_20250901_부동산권리보험(전세자금대출용III)1.pdf"                         "hy-title-jeonse-3-2025.pdf"
CALL :COPY "03.약관_20260105_전기자동차충전시설사고배상책임보험_최종.pdf"                    "hy-ev-charger-2026.pdf"
CALL :COPY "03.약관_20250901_가상자산사업자 배상책임보험.pdf"                                "hy-vasp-2025.pdf"
CALL :COPY "64700000CK_Product Recall Insurance_210120.pdf"                                 "hy-recall-2021.pdf"
CALL :COPY "04-1. 선박보험 국문약관.pdf"                                                     "hy-hull-kor.pdf"
CALL :COPY "21세기선박보험보통약관.hwp.pdf"                                                  "hy-hull-21c.pdf"
CALL :COPY "institute clauses for builder_s risks_eng.pdf"                                  "hy-hull-builders-risk.pdf"
CALL :COPY "04. 약관_submarine cable insurance_eng.hwp.pdf"                                 "hy-hull-submarine-cable.pdf"
CALL :COPY "03.약관_20210101_물류종합보험.pdf"                                               "hy-logistics-2021.pdf"
CALL :COPY "03.약관+20230101+Comprehensive_Export_Credit_Insurance_Policy(AIG_Form).zip"     "hy-trade-credit-aig.zip"
CALL :COPY "03.약관(영문,국문)+20230101+Comprehensive_Export_Credit_Insurance_Policy(Atradius_Form)2.docx" "hy-trade-credit-atradius.docx"
CALL :COPY "03.약관_20230101_Pre and Post Shipment Insurance_(Chubb form).zip"               "hy-trade-credit-chubb.zip"
CALL :COPY "03.약관_20250901_신종날씨보험1.pdf"                                              "hy-weather-2025.pdf"
CALL :COPY "03.약관_20250901_임원배상책임보험.pdf"                                           "hy-do-2025.pdf"
CALL :COPY "03.약관(영문및국문)_20220906_DNO(ZURICH).zip"                                    "hy-do-zurich.zip"
CALL :COPY "03.약관_20221103_DandO(Chubb_Form).zip"                                          "hy-do-chubb.zip"
CALL :COPY "03.약관_20250901_전문직업인배상책임보험1.pdf"                                    "hy-eo-2025.pdf"
CALL :COPY "03.약관_202306_Performance_Insurance(Erros_or_Omissions_Liability)_-최종1_Tmp.pdf" "hy-eo-performance.pdf"
CALL :COPY "03.약관_20250901_기업 중대사고 배상책임보험.pdf"                                 "hy-sapa-2025.pdf"
CALL :COPY "03.약관(영문+번역)+20250901+Hole_In_One Insurance2.doc"                          "hy-holeinone-2025.doc"
CALL :COPY "03.약관+20230101+Cancellation_of_Event_Indemnity_Insurance(영문)1.pdf"           "hy-event-cancel-2023.pdf"
CALL :COPY "03.약관+20230101+Cancellation_and_Abandonment_Insurance_Policy(영문)1.pdf"       "hy-event-abandon-2023.pdf"
CALL :COPY "03.약관_20260101_도난보험.pdf"                                                   "hy-theft-2026.pdf"

REM --- 잔여 28종 (v2 신규) ---
CALL :COPY "03.약관(번역)+20210120+Coating_Guarantee_Legal_Liability_Insurance_Policy.doc"   "hy-coating-guarantee-2021.doc"
CALL :COPY "03.약관(영문)_20210120_Product_Guarantee_Legal_Liability_Policy.DOC"              "hy-product-guarantee-2021.doc"
CALL :COPY "03.약관(영문)_20260101_Products Completed_Operations_Liability(I)1.pdf"           "hy-completed-ops-1-2026.pdf"
CALL :COPY "03.약관(영문)_20260101_Products Completed_Operations_Liability (II)1.pdf"         "hy-completed-ops-2-2026.pdf"
CALL :COPY "03.약관+20230101+CONTRACTUAL_LIABILITY_INSURANCE+영문.pdf"                        "hy-contractual-2023.pdf"
CALL :COPY "03.약관+20230101+Contractual_Liability_Insurance_Policy(Ⅲ)_（약정이행보상보험III）_영문.pdf" "hy-performance-indemnity-2023.pdf"
CALL :COPY "03.약관_20250901_분산에너지사업자 배상책임보험.pdf"                               "hy-distributed-energy-2025.pdf"
CALL :COPY "03.약관_20250901_실외이동로봇_배상책임보험.pdf"                                    "hy-outdoor-robot-2025.pdf"
CALL :COPY "03.약관_20250901_야생동물피해보상보험.pdf"                                         "hy-wildlife-2025.pdf"
CALL :COPY "03.약관_20250901_옥외광고물 손해배상책임보험 .pdf"                                 "hy-outdoor-ad-2025.pdf"
CALL :COPY "03.약관_20250901_의료기기 배상책임보험.pdf"                                        "hy-medical-device-2025.pdf"
CALL :COPY "03.약관_20250901_전기용품 안전성검사기관 전문인배상책임보험.pdf"                   "hy-elec-inspector-2025.pdf"
CALL :COPY "03.약관_20250901_규제샌드박스배상책임보험1.pdf"                                    "hy-sandbox-2025.pdf"
CALL :COPY "03.약관_20250901_생산물종합배상책임보험(산업융합신제품용).pdf"                     "hy-fusion-pl-2025.pdf"
CALL :COPY "03.약관_20230101_NoFault_Compensation.zip"                                         "hy-no-fault-2023.zip"
CALL :COPY "03.약관+20200101+양어보험+국문.pdf"                                                "hy-aquaculture-2020.pdf"
CALL :COPY "03.약관_20240501_가축재해보험3.zip"                                                "hy-livestock-2024.zip"
CALL :COPY "03.약관(영문)_20230101_Equine_Insurance_Policy.pdf"                                "hy-equine-2023.pdf"
CALL :COPY "73000001CK_Live-Stock_Insurance_Policy(번역문)_200101.pdf"                         "hy-livestock-policy.pdf"
CALL :COPY "72000000CK_유리보험_190101.pdf"                                                    "hy-glass-2019.pdf"
CALL :COPY "76700000CK_잔존가액보상보험_190101.pdf"                                            "hy-residual-value-2019.pdf"
CALL :COPY "03.약관_20250901_주택ㆍ온실_풍수해·지진재해보험（I）2.pdf"                          "hy-storm-flood-1-2025.pdf"
CALL :COPY "03.약관_20260101_실손비례보상_주택_풍수해·지진재해보험（III）.pdf"                  "hy-storm-flood-3-2026.pdf"
CALL :COPY "78000001CK_동산권리보험_양식변경_20210101.pdf"                                     "hy-chattel-title-2021.pdf"
CALL :COPY "04.Marine Ransom and Extortion Insurance 영문약관(CHUBB From).doc"                 "hy-marine-ransom.doc"
CALL :COPY "03.약관+20230101+Sports_Prize_Indemnity_Insurance(Ⅰ)_영문.pdf"                     "hy-sports-prize-1-2023.pdf"
CALL :COPY "03.약관+20230101+Sports_Prize_Indemnity_Insurance(Ⅱ)_영문.pdf"                     "hy-sports-prize-2-2023.pdf"
CALL :COPY "03.약관+20230101_Over_Redemption_Insurance_Policy(영문+번역).pdf"                  "hy-over-redemption-2023.pdf"
CALL :COPY "03.약관_20230101_Buyers_Warranty_and_Indemnity_Insurance.pdf"                      "hy-wni-buyer-2023.pdf"
CALL :COPY "03.약관_20230101_Seller_s_Warranty_and_Indemnity_Insurance1.pdf"                   "hy-wni-seller-2023.pdf"
CALL :COPY "03.약관_20260101_Money_and_Securities_Policy.zip"                                  "hy-money-securities-2026.zip"
CALL :COPY "03.약관_20260101_하이펫애견보험.pdf"                                               "hy-pet-2026.pdf"
CALL :COPY "03.약관+20260101+법률비용보상보험.pdf"                                             "hy-legal-expense-2026.pdf"
CALL :COPY "03.약관_20230101_New_Cyber_Security.zip"                                           "hy-new-cyber-2023.zip"
CALL :COPY "03.약관(영문및번역)_20240401_Cyber Insurace for SME.zip"                           "hy-cyber-sme-2024.zip"
CALL :COPY "03.약관_20260101_직업훈련생재해보상.pdf"                                           "hy-vocational-trainee-2026.pdf"

ECHO.
ECHO =================================================================
ECHO 완료되었습니다.
ECHO =================================================================
DIR "%DST%\hy-*.*" | FIND /C "hy-"
PAUSE
EXIT /B

:COPY
IF EXIST "%SRC%\%~1" (
    COPY /Y "%SRC%\%~1" "%DST%\%~2" >NUL
    IF ERRORLEVEL 1 (
        ECHO   [FAIL] %~2
    ) ELSE (
        ECHO   [ OK ] %~2
    )
) ELSE (
    ECHO   [MISS] 원본 없음: %~1
)
EXIT /B
