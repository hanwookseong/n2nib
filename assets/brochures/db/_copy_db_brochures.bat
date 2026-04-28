@echo off
REM ============================================================
REM  N2N 엔투엔보험중개 - DB손해보험 상품설명서 PDF 배포 스크립트
REM  2026년 DB 안내장(준감필) 16종을 홈페이지 /assets/brochures/db/로
REM  웹용 네이밍(db-*.pdf)으로 복사합니다.
REM
REM  사용법: 이 파일을 더블클릭하거나 명령프롬프트에서 실행하세요.
REM ============================================================

SETLOCAL EnableDelayedExpansion
CHCP 65001 >NUL

SET "SRC=C:\Users\hanwo\OneDrive\A A_N2NIB_엔투엔보험중개\원수사\DB\상품내용설명서\2026DB일반보험상품설명서"
SET "DST=C:\Users\hanwo\OneDrive\A A_N2NIB_엔투엔보험중개\원수사\N2N보험중개취급상품카탈로그\홈페이지\assets\brochures\db"

IF NOT EXIST "%DST%" MKDIR "%DST%"

ECHO.
ECHO =================================================================
ECHO DB 상품설명서 PDF 배포 시작
ECHO SRC = %SRC%
ECHO DST = %DST%
ECHO =================================================================

CALL :COPY "01_DB손보_법인_건설공사보험_안내장(16P)_준감필_20260213_단면.pdf"               "db-car-2026.pdf"
CALL :COPY "01_DB손보_법인_건설공사보험_안내장(16P)_준감필_20260213_펼침.pdf"               "db-car-2026-spread.pdf"
CALL :COPY "02_DB손보_법인_국내근로자재해보장책임보험_안내장(16P)_검시필_20260220_단면.pdf"   "db-wc-domestic-2026.pdf"
CALL :COPY "02_DB손보_법인_국내근로자재해보장책임보험_안내장(16P)_검시필_20260220_펼침.pdf"   "db-wc-domestic-2026-spread.pdf"
CALL :COPY "05_DB손보_법인_생산물배상책임보험_안내장(16P)_20250725수정_준감필20260213_단면.pdf" "db-pl-2026.pdf"
CALL :COPY "05_DB손보_법인_생산물배상책임보험_안내장(16P)_20250725수정_준감필20260213_펼침.pdf" "db-pl-2026-spread.pdf"
CALL :COPY "08_DB손보_법인_엑설런트종합보험_안내장(16P)_준감필_20260213_단면.pdf"            "db-excellent-2026.pdf"
CALL :COPY "08_DB손보_법인_엑설런트종합보험_안내장(16P)_준감필_20260213_펼침.pdf"            "db-excellent-2026-spread.pdf"
CALL :COPY "09_DB손보_법인_영업배상책임보험_시설소유관리자_안내장(16P)_준감필_20260213_단면.pdf" "db-cgl-2026.pdf"
CALL :COPY "09_DB손보_법인_영업배상책임보험_시설소유관리자_안내장(16P)_준감필_20260213_펼침.pdf" "db-cgl-2026-spread.pdf"
CALL :COPY "12_DB손보_법인_주택화재보험_안내장(16P)준감필_20260211_단면.pdf"                 "db-fire-home-2026.pdf"
CALL :COPY "12_DB손보_법인_주택화재보험_안내장(16P)준감필_20260211_펼침.pdf"                 "db-fire-home-2026-spread.pdf"
CALL :COPY "16_DB손보_법인_패키지보험_종합_안내장(16P)_준감필_20260213_단면.pdf"             "db-package-2026.pdf"
CALL :COPY "16_DB손보_법인_패키지보험_종합_안내장(16P)_준감필_20260213_펼침.pdf"             "db-package-2026-spread.pdf"
CALL :COPY "18_DB손보_법인_화재보험_안내장(16P)준감필_20260211단면.pdf"                      "db-fire-2026.pdf"
CALL :COPY "18_DB손보_법인_화재보험_안내장(16P)준감필_20260211펼침.pdf"                      "db-fire-2026-spread.pdf"

ECHO.
ECHO =================================================================
ECHO 완료되었습니다.
ECHO =================================================================
DIR "%DST%\db-*.pdf"
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
