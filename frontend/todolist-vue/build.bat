npm run build:pre

if exist ..\todolist\assets del /f /s /q ..\todolist\assets

xcopy dist\* ..\todolist\ /e /y
