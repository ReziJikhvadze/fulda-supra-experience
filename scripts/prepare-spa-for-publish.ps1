# Build frontend and copy into Fulda.API/spa for Azure publish
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$wwwroot = Join-Path $root "Fulda.API\Fulda.API\wwwroot"
$spa = Join-Path $root "Fulda.API\Fulda.API\spa"

Push-Location $wwwroot
npm ci
$env:VITE_API_URL = ""
npm run build:azure
Pop-Location

if (Test-Path $spa) { Remove-Item -Recurse -Force $spa }
New-Item -ItemType Directory -Path $spa | Out-Null
Copy-Item -Recurse (Join-Path $wwwroot "dist\azure\*") $spa
Write-Host "SPA ready in Fulda.API/Fulda.API/spa"
