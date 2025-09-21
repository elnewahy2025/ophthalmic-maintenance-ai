@echo off
cls
echo ========================================
echo Ophthalmic Maintenance AI - Full Setup
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js v18 or higher from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js version: 
node --version
echo.

REM Create main project directory
echo Creating project structure...
mkdir ophthalmic-maintenance-ai
cd ophthalmic-maintenance-ai

REM === BACKEND SETUP ===
echo.
echo [1/3] Setting up Backend...
mkdir backend
cd backend

REM Create package.json
echo { "name": "ophthalmic-backend", "version": "1.0.0", "private": true, "scripts": { "build": "tsc", "start": "node dist/server.js", "dev": "ts-node src/server.ts" } } > package.json

REM Install backend dependencies
echo Installing backend dependencies...
npm install express@^4.18.2 cors@^2.8.5 dotenv@^16.3.1 @supabase/supabase-js@^2.38.0 openai@^4.20.0 pdf-parse@^1.1.1 multer@^1.4.5-lts.1 fs-extra@^11.1.1 uuid@^9.0.1
npm install -D typescript@^5.2.2 ts-node@^10.9.1 @types/node@^20.8.7 @types/express@^4.17.19 @types/multer@^1.4.8

REM Create directory structure
mkdir src src\controllers src\middleware src\services src\utils uploads

REM Create tsconfig.json
(
echo {
echo   "compilerOptions": {
echo     "target": "ES2020",
echo     "module": "commonjs",
echo     "lib": ["ES2020"],
echo     "outDir": "./dist",
echo     "rootDir": "./src",
echo     "strict": true,
echo     "esModuleInterop": true,
echo     "skipLibCheck": true,
echo     "forceConsistentCasingInFileNames": true
echo   },
echo   "include": ["src/**/*"],
echo   "exclude": ["node_modules"]
echo }
) > tsconfig.json

cd ..

REM === FRONTEND SETUP ===
echo.
echo [2/3] Setting up Frontend...
npx create-next-app@latest frontend --typescript --tailwind --eslint
cd frontend
npm install @headlessui/react@^1.7.17 @heroicons/react@^2.0.18 @supabase/supabase-js@^2.38.0 react-dropzone@^14.2.3
npm install -D @types/node@^20 @types/react@^18 @types/react-dom@^18
cd ..

REM === CREATE START SCRIPT ===
echo.
echo [3/3] Creating start script...
(
echo @echo off
echo echo ========================================
echo echo Starting Ophthalmic Maintenance AI
echo echo ========================================
echo echo.
echo if not exist "backend" ^(
echo     echo ERROR: Backend directory not found!
echo     pause
echo     exit /b 1
echo ^)
echo if not exist "frontend" ^(
echo     echo ERROR: Frontend directory not found!
echo     pause
echo     exit /b 1
echo ^)
echo echo Starting backend server...
echo start "Backend Server" cmd /k "cd backend && npm run dev"
echo timeout /t 5 /nobreak ^>nul
echo echo Starting frontend server...
echo start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo echo.
echo echo ========================================
echo echo Servers Started Successfully!
echo echo ========================================
echo echo Backend:  http://localhost:3001
echo echo Frontend: http://localhost:3000
echo echo.
echo echo Press CTRL+C to stop servers
echo pause ^>nul
) > start-project.bat

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Add your API keys to backend/.env
echo 2. Add your API keys to frontend/.env.local
echo 3. Run start-project.bat to start both servers
echo.
echo Files created:
echo - backend/ (with all dependencies)
echo - frontend/ (with all dependencies)
echo - start-project.bat (to run both servers)
echo.
pause