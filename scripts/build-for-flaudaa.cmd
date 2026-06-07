@echo off
REM Easiest deploy: build site into spa\ then Visual Studio Publish -> flaudaa (ONE app, ONE URL)
cd /d "%~dp0.."
set WWWROOT=%CD%\Fulda.API\Fulda.API\wwwroot
set SPA=%CD%\Fulda.API\Fulda.API\spa

echo [1/4] sync logo...
copy /y "%CD%\src\assets\logo.png" "%WWWROOT%\public\logo.png" >nul
copy /y "%CD%\src\assets\logo.png" "%WWWROOT%\public\favicon.png" >nul

echo [2/4] npm build...
cd /d "%WWWROOT%"
set VITE_API_URL=
call npm.cmd run build:azure
if errorlevel 1 exit /b 1

echo [3/4] copy to spa folder...
cd /d "%~dp0.."
if exist "%SPA%" rmdir /s /q "%SPA%"
mkdir "%SPA%"
xcopy /e /i /y "%WWWROOT%\dist\azure\*" "%SPA%\"

echo [4/4] done.
echo.
echo NEXT: Open Visual Studio ^> Fulda.API ^> Publish ^> flaudaa ^> Publish
echo SITE:  https://flaudaa-dwf9bhg5e8g6bebv.canadacentral-01.azurewebsites.net
echo.
