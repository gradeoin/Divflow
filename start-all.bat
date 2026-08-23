@echo off
title Divflow Automation Suite Launcher
echo ========================================
echo    Launching All Divflow Services
echo ========================================
cd /d "D:\GIThub\Divflow"
powershell -ExecutionPolicy Bypass -File "D:\GIThub\Divflow\scripts\start-all.ps1"
pause
