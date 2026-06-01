# Build frontend and create a zip for flaudaa-web (manual deploy)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$wwwroot = Join-Path $root "Fulda.API\Fulda.API\wwwroot"
$out = Join-Path $root "publish\web"
$zip = Join-Path $root "publish\flaudaa-web.zip"
$apiUrl = "https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net"

Push-Location $wwwroot
npm.cmd ci
$env:VITE_API_URL = $apiUrl
npm.cmd run build:azure
Pop-Location

if (Test-Path $out) { Remove-Item -Recurse -Force $out }
New-Item -ItemType Directory -Path $out | Out-Null
Copy-Item -Recurse (Join-Path $wwwroot "dist\azure\*") $out
Copy-Item (Join-Path $wwwroot "azure-host\package.json") $out
Copy-Item (Join-Path $wwwroot "azure-host\.deployment") $out

Push-Location $out
npm.cmd install --omit=dev --no-audit --no-fund
Pop-Location

if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path "$out\*" -DestinationPath $zip -Force

Write-Host ""
Write-Host "Built. API URL in bundle: $apiUrl"
Write-Host "Zip: $zip"
Write-Host ""
Write-Host "Azure flaudaa-web settings (Configuration):"
Write-Host "  SCM_DO_BUILD_DURING_DEPLOYMENT = false"
Write-Host "  WEBSITES_PORT = 8080"
Write-Host "  Startup command: npm start"
Write-Host ""
Write-Host "Deploy zip:"
Write-Host "  Azure Portal -> flaudaa-web -> Deployment Center -> ZIP Deploy"
Write-Host "  Or: az webapp deploy --resource-group flaud --name flaudaa-web --src-path `"$zip`" --type zip"
