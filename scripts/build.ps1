$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $projectRoot
try {
    & npx vite build
    if ($LASTEXITCODE -ne 0) { throw "Vite build failed with code $LASTEXITCODE" }
    & (Join-Path $PSScriptRoot 'third-party-notices.ps1')
    Copy-Item -LiteralPath (Join-Path $projectRoot 'LICENSE') -Destination (Join-Path $projectRoot 'dist/LICENSE') -Force
}
finally {
    Pop-Location
}
