@echo off
cd /d "%~dp0"
where ollama >nul 2>nul
if errorlevel 1 (
  echo Install Ollama from https://ollama.com first.
  pause
  exit /b 1
)
ollama list
echo FeatherLog needs the qwen2.5vl:7b vision model.
echo If it is missing above, run: ollama pull qwen2.5vl:7b
if not exist node_modules call npm.cmd ci
if errorlevel 1 exit /b 1
call npm.cmd run build
if errorlevel 1 exit /b 1
echo Open http://127.0.0.1:4173 in your browser.
echo Keep this window open while using FeatherLog.
call npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
pause
