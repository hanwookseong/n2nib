# =============================================================
#  배포_예술품카드_specialty-art.ps1
#  대상: cargoinsu  /  products/specialty-art.html
#  내용: 아트딜러 캠페인 CTA 카드 추가 (예술품종합보험 본문 끝)
#  작성: 2026-05-26
#  실행: powershell -ExecutionPolicy Bypass -File "$HOME\Downloads\배포_예술품카드_specialty-art.ps1"
# =============================================================

$ErrorActionPreference = 'Stop'
$repo   = "$HOME\Github\cargoinsu"
$target = Join-Path $repo 'products\specialty-art.html'

Write-Host ""
Write-Host "=== cargoinsu 예술품종합보험 CTA 카드 배포 ===" -ForegroundColor Cyan

# --- Phase 0: Downloads의 files*.zip 자동 해제 ---------------
$dl = (New-Object -ComObject Shell.Application).Namespace('shell:Downloads').Self.Path
Write-Host "[0] Downloads 경로: $dl"
$zips = Get-ChildItem -Path $dl -Filter 'files*.zip' -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime
foreach ($z in $zips) {
    Write-Host "    압축 해제: $($z.Name)"
    Expand-Archive -Path $z.FullName -DestinationPath $dl -Force
    Remove-Item $z.FullName -Force
}

# --- Phase 1: 배포 파일 확인 --------------------------------
$src = Join-Path $dl 'specialty-art.html'
if (-not (Test-Path $src)) {
    Write-Host "[중단] Downloads에 specialty-art.html 이 없습니다." -ForegroundColor Red
    exit 1
}
$content = Get-Content $src -Raw -Encoding UTF8
if ($content -notmatch 'fa-cta-card') {
    Write-Host "[중단] specialty-art.html 에 CTA 카드(fa-cta-card)가 없습니다 — 잘못된 파일." -ForegroundColor Red
    exit 1
}
Write-Host "[1] 배포 파일 확인 OK (아트딜러 CTA 카드 반영본)"

# --- Phase 2: 레포 배치 ------------------------------------
if (-not (Test-Path (Join-Path $repo 'products'))) {
    Write-Host "[중단] 레포 경로가 없습니다: $repo\products" -ForegroundColor Red
    exit 1
}
Copy-Item $src $target -Force
Write-Host "[2] 레포 배치 완료: $target"

# 배치 검증 1
$check = Get-Content $target -Raw -Encoding UTF8
if ($check -notmatch 'fa-cta-card') {
    Write-Host "[중단] 배치 검증 실패." -ForegroundColor Red
    exit 1
}
Write-Host "    배치 검증 1 OK"

# --- Phase 3: git add / commit / push -----------------------
Set-Location $repo
git add products/specialty-art.html
$staged = git diff --cached --name-only
if ([string]::IsNullOrWhiteSpace($staged)) {
    Write-Host "[3] 변경 사항 없음 — 이미 배포된 상태입니다 (멱등)." -ForegroundColor Yellow
} else {
    git commit -m "feat: 예술품종합보험 페이지에 아트딜러 캠페인 CTA 카드 추가"
    git push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[중단] git push 실패 — 네트워크/인증 확인 필요." -ForegroundColor Red
        exit 1
    }
    Write-Host "[3] git push 완료" -ForegroundColor Green
}

# 배치 검증 2
Write-Host ""
git status --short
Write-Host ""
Write-Host "=== 배포 완료 — Cloudflare Pages 1~2분 내 라이브 반영 ===" -ForegroundColor Cyan
