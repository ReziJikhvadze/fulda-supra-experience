# One-time upload of wwwroot/src/assets images to Azure Blob + SQL ImageUrl updates.
# See docs/SEED-BLOB-IMAGES.md

$ErrorActionPreference = "Stop"
$apiDir = Join-Path $PSScriptRoot "..\Fulda.API\Fulda.API"

if (-not $env:AzureStorage__ConnectionString) {
    Write-Host "Set AzureStorage__ConnectionString (and ConnectionStrings__DefaultConnection) first." -ForegroundColor Yellow
    Write-Host "Example:"
    Write-Host '  $env:AzureStorage__ConnectionString = "<from Azure Portal → Storage → Access keys>"'
    Write-Host '  $env:ConnectionStrings__DefaultConnection = "<your SQL connection string>"'
    exit 1
}

Push-Location $apiDir
try {
    dotnet run -- --seed-blob-images
}
finally {
    Pop-Location
}
