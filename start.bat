@echo off
REM WSJ Morse Programma - Start script voor Windows
REM Dubbelklik op dit bestand om de applicatie te starten

echo Starten van WSJ Morse Programma...
echo.

REM Controleer of Node.js is geinstalleerd
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo FOUT: Node.js is niet geinstalleerd!
    echo.
    echo Download en installeer Node.js eerst:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Start de Electron applicatie
npm start

if %errorlevel% neq 0 (
    echo.
    echo Er is een fout opgetreden.
    echo Controleer of alle dependencies zijn geinstalleerd met: npm install
    pause
)
