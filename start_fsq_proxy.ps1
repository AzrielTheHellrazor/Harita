$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Tek proxy: main_proxy.js hem HERE hem Foursquare'i yonetir.
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node bulunamadi. https://nodejs.org adresinden yukle."
    exit 1
}

$argsList = @("main_proxy.js")

if ($args.Count -gt 0 -and $args[0] -eq "-detached") {
    Start-Process -FilePath $node.Source -ArgumentList $argsList -WindowStyle Hidden
    Write-Host "Proxy arka planda baslatildi (http://localhost:3001)."
    exit 0
}

Write-Host "Proxy baslatiliyor (http://localhost:3001)..."
& $node.Source @argsList
