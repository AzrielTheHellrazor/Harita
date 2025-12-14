$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Node kontrolu
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node bulunamadi. https://nodejs.org adresinden yukle."
    exit 1
}

# HERE anahtari yoksa hatirlatici
if (-not $env:HERE_API_KEY) {
    Write-Host "HERE_API_KEY ortam degiskeni set edilmemis. Proxy dogru calismayacak."
}

$argsList = @("main_proxy.js")

if ($args.Count -gt 0 -and $args[0] -eq "-detached") {
    Start-Process -FilePath $node.Source -ArgumentList $argsList -WindowStyle Hidden
    Write-Host "Proxy arka planda baslatildi (http://localhost:3001)."
    exit 0
}

Write-Host "Proxy baslatiliyor (http://localhost:3001)..."
& $node.Source @argsList
