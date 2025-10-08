@echo off
echo.
echo ================================================
echo  SPMO System - Development Server
echo  Camarines Norte State College
echo ================================================
echo.
echo Starting PHP development server...
echo Server will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
php -S localhost:8000 -t public/
pause