# =====================================================================
#  n2nib — en/products/*.html 111개 og:image 를 영문 카드로 전환
#  https://n2nib.com/assets/og-image.png  →  .../og-image-en.png
#
#  N2N 로고적용표준 v1.1 §6 (파일 편집 필수 규칙) 준수:
#   - ReadAllText(path, encoding) 금지 → ReadAllBytes + GetString/GetBytes
#   - 편집 전후 한글 글자수 비교 (본 작업은 ASCII 치환이므로 델타 0 이어야 함)
#   - 검증 실패 시 해당 파일 기록 취소
# =====================================================================

$ErrorActionPreference = 'Stop'
$root = 'C:\Users\성한욱\Github\n2nib\en\products'
$old  = 'https://n2nib.com/assets/og-image.png'
$new  = 'https://n2nib.com/assets/og-image-en.png'

if (-not (Test-Path $root)) { throw "경로 없음: $root" }

# UTF-8 (BOM 미출력) — 원본 BOM 유무를 그대로 보존하기 위해 수동 처리
$utf8 = New-Object System.Text.UTF8Encoding($false)
$bom  = [byte[]](0xEF, 0xBB, 0xBF)

function Get-HangulCount([string]$s) {
    ([regex]::Matches($s, '[\uAC00-\uD7A3]')).Count
}

$files   = Get-ChildItem -Path $root -Filter *.html -File | Sort-Object Name
$changed = 0; $skipped = 0; $failed = @()

Write-Host "[Phase 1] 대상 $($files.Count) 개 파일" -ForegroundColor Cyan

foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)

    # BOM 유무 판별 후 본문만 디코딩
    $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    $body   = if ($hasBom) { $bytes[3..($bytes.Length - 1)] } else { $bytes }
    $text   = $utf8.GetString($body)

    $hits = ([regex]::Matches($text, [regex]::Escape($old))).Count
    if ($hits -eq 0) { $skipped++; continue }

    $before = Get-HangulCount $text
    $out    = $text.Replace($old, $new)
    $after  = Get-HangulCount $out

    # ASCII 치환이므로 한글 수는 변하지 않아야 한다
    if ($after -ne $before) {
        $failed += "$($f.Name) — 한글 $before → $after (예상 $before)"
        continue
    }
    if ($out -match [regex]::Escape($old)) {
        $failed += "$($f.Name) — 구 URL 잔존"
        continue
    }

    $outBytes = $utf8.GetBytes($out)
    if ($hasBom) { $outBytes = $bom + $outBytes }
    [System.IO.File]::WriteAllBytes($f.FullName, $outBytes)

    $changed++
    Write-Host ("  {0,-52} {1}건 치환" -f $f.Name, $hits)
}

Write-Host ""
Write-Host "[Phase 2] 결과" -ForegroundColor Cyan
Write-Host "  치환 완료 : $changed"
Write-Host "  건너뜀    : $skipped  (구 URL 없음)"
Write-Host "  실패      : $($failed.Count)"
if ($failed.Count -gt 0) {
    Write-Host ""
    Write-Host "  ★ 실패 목록 (기록하지 않음)" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    throw "검증 실패 파일이 있습니다. 커밋 전 확인하십시오."
}

Write-Host ""
Write-Host "[Phase 3] 최종 확인" -ForegroundColor Cyan
$remain = (Select-String -Path "$root\*.html" -SimpleMatch $old -List).Count
$applied = (Select-String -Path "$root\*.html" -SimpleMatch $new -List).Count
Write-Host "  국문 카드 참조 잔존 : $remain"
Write-Host "  영문 카드 적용      : $applied 개 파일"
if ($remain -ne 0) { throw "국문 카드 참조가 남아 있습니다." }

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host " 완료 — 아래 명령으로 커밋하십시오" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host '   cd C:\Users\성한욱\Github\n2nib'
Write-Host '   git add -A'
Write-Host '   git commit -m "fix: en/products 111개 og:image 를 영문 카드로 전환"'
Write-Host '   git push'
