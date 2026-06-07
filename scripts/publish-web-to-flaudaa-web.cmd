@echo off
setlocal
cd /d "%~dp0.."
set ROOT=%CD%
set WWWROOT=%ROOT%\Fulda.API\Fulda.API\wwwroot
set OUT=%ROOT%\publish\web
set ZIP=%ROOT%\publish\flaudaa-web.zip
set VITE_API_URL=https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net

echo Syncing logo from src\assets\logo.png...
copy /y "%ROOT%\src\assets\logo.png" "%WWWROOT%\public\logo.png" >nul
copy /y "%ROOT%\src\assets\logo.png" "%WWWROOT%\public\favicon.png" >nul

echo Building frontend...
cd /d "%WWWROOT%"
call npm.cmd install
set VITE_API_URL=%VITE_API_URL%
call npm.cmd run build:azure
if errorlevel 1 exit /b 1

cd /d "%ROOT%"
if exist "%OUT%" rmdir /s /q "%OUT%"
mkdir "%OUT%"
xcopy /e /i /y "%WWWROOT%\dist\azure\*" "%OUT%\"
copy /y "%WWWROOT%\azure-host\package.json" "%OUT%\"
copy /y "%WWWROOT%\azure-host\.deployment" "%OUT%\"

cd /d "%OUT%"
call npm.cmd install --omit=dev --no-audit --no-fund
if errorlevel 1 exit /b 1

cd /d "%ROOT%"
if exist "%ZIP%" del /f "%ZIP%"
powershell -NoProfile -Command "Compress-Archive -Path '%OUT%\*' -DestinationPath '%ZIP%' -Force"

echo.
echo DONE: %ZIP%
echo Main site logo: src\assets\logo.png (nav, footer, admin, favicon)
echo.
echo Before ZIP deploy: wipe wwwroot in Kudu Bash (see docs/FIX-OLD-LOGO-AFTER-ZIP-DEPLOY.md)
