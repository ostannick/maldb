ECHO OFF

echo Starting the malDB PHP development server over the wide area network using port 8000...
start cmd /k php artisan serve --host 0.0.0.0 --port 8000
echo Success.

echo Starting the job queue...
start cmd /k php artisan queue:work --timeout=0
echo Success.

echo Opening the malDB browser-based client...
explorer http://localhost:8000/
echo Success.

echo malDB started successfully. You can now close this window, but leave all other terminal windows open!
pause



