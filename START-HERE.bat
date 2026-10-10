@echo off
title Verath Auto
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. Install the LTS version from https://nodejs.org then double-click this file again. & pause & exit /b)
if not exist node_modules (echo Installing, please wait... & call npm install)
if not exist data mkdir data
if not exist data\.demo-phase2 (echo Loading demo data... & call npm run seed & echo loaded> data\.demo-phase2)
if not exist .env (copy .env.example .env >nul & echo Created .env. Add your AI key there later to switch on all AI features.)
start "" http://localhost:3000
echo.
echo Verath Auto is running. Keep this window open. Close it to stop.
call npm start
pause
