$ErrorActionPreference = 'Stop'
$env:IWSDK_DEV_OPEN = 'false'
$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $projectRoot
try {
    & npx vite --host 127.0.0.1 --port 4329 --strictPort
    if ($LASTEXITCODE -ne 0) { throw "Vite exited with code $LASTEXITCODE" }
}
finally {
    Pop-Location
}
