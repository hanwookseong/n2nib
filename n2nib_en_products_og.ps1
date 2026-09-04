# =====================================================================
#  n2nib - switch og:image on en/products/*.html to the English card
#     https://n2nib.com/assets/og-image.png  ->  .../og-image-en.png
#
#  ASCII-only by design: Windows PowerShell 5.1 reads .ps1 as ANSI when
#  the file has no UTF-8 BOM, which corrupts non-ASCII literals.
#  Path is derived from $PSScriptRoot so no Korean literal is needed.
#
#  Follows N2N logo standard v1.1 section 6 (file editing rules):
#    - no ReadAllText(path, encoding); use ReadAllBytes + GetString/GetBytes
#    - preserve each file's original BOM state
#    - compare Hangul character count before/after (must be unchanged here,
#      since this is an ASCII-only replacement); skip the file if it differs
# =====================================================================

$ErrorActionPreference = 'Stop'

$root = Join-Path $PSScriptRoot 'en\products'
$old  = 'https://n2nib.com/assets/og-image.png'
$new  = 'https://n2nib.com/assets/og-image-en.png'

if (-not (Test-Path -LiteralPath $root)) { throw "Directory not found: $root" }

$utf8 = New-Object System.Text.UTF8Encoding($false)
$bom  = [byte[]](0xEF, 0xBB, 0xBF)

function Get-HangulCount([string]$s) {
    ([regex]::Matches($s, '[\uAC00-\uD7A3]')).Count
}

$files   = @(Get-ChildItem -LiteralPath $root -Filter *.html -File | Sort-Object Name)
$changed = 0
$skipped = 0
$failed  = @()

Write-Host ""
Write-Host "[1/3] Scanning $($files.Count) files in en\products" -ForegroundColor Cyan

foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)

    $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    if ($hasBom) { $body = $bytes[3..($bytes.Length - 1)] } else { $body = $bytes }
    $text = $utf8.GetString($body)

    $hits = ([regex]::Matches($text, [regex]::Escape($old))).Count
    if ($hits -eq 0) { $skipped++; continue }

    $before = Get-HangulCount $text
    $out    = $text.Replace($old, $new)
    $after  = Get-HangulCount $out

    if ($after -ne $before) {
        $failed += "$($f.Name) - Hangul $before -> $after (expected $before)"
        continue
    }
    if ($out.Contains($old)) {
        $failed += "$($f.Name) - old URL still present"
        continue
    }

    $outBytes = $utf8.GetBytes($out)
    if ($hasBom) { $outBytes = $bom + $outBytes }
    [System.IO.File]::WriteAllBytes($f.FullName, $outBytes)

    $changed++
    Write-Host ("      {0,-52} {1} replaced" -f $f.Name, $hits)
}

Write-Host ""
Write-Host "[2/3] Result" -ForegroundColor Cyan
Write-Host "      changed : $changed"
Write-Host "      skipped : $skipped  (old URL not present)"
Write-Host "      failed  : $($failed.Count)"

if ($failed.Count -gt 0) {
    Write-Host ""
    Write-Host "      NOT WRITTEN - verification failed:" -ForegroundColor Red
    foreach ($x in $failed) { Write-Host "        $x" -ForegroundColor Red }
    throw "Verification failed on $($failed.Count) file(s). Review before committing."
}

Write-Host ""
Write-Host "[3/3] Final check" -ForegroundColor Cyan
$remain  = @(Select-String -Path "$root\*.html" -SimpleMatch $old -List).Count
$applied = @(Select-String -Path "$root\*.html" -SimpleMatch $new -List).Count
Write-Host "      files still on the Korean card : $remain"
Write-Host "      files on the English card      : $applied"
if ($remain -ne 0) { throw "Korean card references remain." }

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host " Done. Commit with:" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host '   git add -A'
Write-Host '   git commit -m "fix: en/products og:image -> English card"'
Write-Host '   git push'
Write-Host ""
