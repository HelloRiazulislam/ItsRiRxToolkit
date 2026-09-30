export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/x-bat; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="ItsRiRx-ToolKit.bat"');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const batContent = `@echo off
:: ============================================================================
::  ItsRiRx Windows Tool Kit - 1-Click Desktop Launcher
::  Compatibility: Windows 10, Windows 11 (64-bit)
:: ============================================================================
title ItsRiRx Windows Tool Kit
color 0b

:: Check for Administrator elevation
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Administrator rights required. Requesting elevation...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Launching remote suite...
echo ============================================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm https://itsrirx-toolkit.vercel.app/i | iex"

echo.
echo Press any key to exit...
pause >nul
`;

  return res.status(200).send(batContent);
}
