@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   VibeMatch.tech - Deployment Script
echo ========================================
echo.

REM Check if gcloud is installed and authenticated
echo [1/6] Checking Google Cloud CLI...
gcloud auth list --filter=status:ACTIVE --format="value(account)" > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: You are not authenticated with Google Cloud CLI
    echo Please run: gcloud auth login
    pause
    exit /b 1
)

REM Set project
echo [2/6] Setting project to vibematch-ai...
gcloud config set project vibematch-ai

REM Check if Cloud Build API is enabled
echo [3/6] Checking if Cloud Build API is enabled...
gcloud services list --enabled --filter="name:cloudbuild.googleapis.com" --format="value(name)" > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Enabling Cloud Build API...
    gcloud services enable cloudbuild.googleapis.com
    echo Waiting for API to be ready...
    timeout /t 30 /nobreak > nul
)

REM Check current service status
echo [4/6] Checking current service status...
gcloud run services describe vibematch-ai --region=europe-west9 --format="value(status.url)" > current_url.txt 2>nul
if %ERRORLEVEL% equ 0 (
    set /p CURRENT_URL=<current_url.txt
    echo Current service URL: !CURRENT_URL!

    REM Test current service
    echo Testing current service health...
    curl -f -s "!CURRENT_URL!/health" > nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo ✓ Current service is healthy
    ) else (
        echo ⚠ WARNING: Current service health check failed
        set /p CONTINUE="Continue with deployment? (y/N): "
        if /i not "!CONTINUE!"=="y" (
            echo Deployment cancelled
            del current_url.txt 2>nul
            pause
            exit /b 1
        )
    )
) else (
    echo No existing service found - this will be a new deployment
)

del current_url.txt 2>nul

REM Get commit information for build description
echo [5/6] Getting current commit information...
for /f "delims=" %%i in ('git rev-parse --short HEAD 2^>nul') do set COMMIT_SHA=%%i
for /f "delims=" %%i in ('git log -1 --pretty^=format:"%%s" 2^>nul') do set COMMIT_MSG=%%i

if "%COMMIT_SHA%"=="" (
    set BUILD_DESC="Manual deployment"
) else (
    set BUILD_DESC="Deploy commit %COMMIT_SHA%: %COMMIT_MSG%"
)

echo Build description: %BUILD_DESC%

REM Start Cloud Build
echo [6/6] Starting Cloud Build deployment...
echo This will:
echo   - Build your Docker image in the cloud
echo   - Deploy with zero-downtime (gradual traffic switch)
echo   - Maintain your domain vibematch.tech
echo   - Keep all environment variables
echo.

gcloud builds submit --config=cloudbuild.yaml --substitutions=_BUILD_DESC="%BUILD_DESC%" .

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================
    echo        DEPLOYMENT SUCCESSFUL! 🚀
    echo ========================================
    echo.
    echo Your site is live at: https://vibematch.tech
    echo.
    echo Checking final service status...
    timeout /t 5 /nobreak > nul

    gcloud run services describe vibematch-ai --region=europe-west9 --format="value(status.url)" > final_url.txt 2>nul
    if exist final_url.txt (
        set /p FINAL_URL=<final_url.txt
        echo Service URL: !FINAL_URL!

        echo Testing deployed service...
        curl -f -s "!FINAL_URL!/health" > nul 2>&1
        if !ERRORLEVEL! equ 0 (
            echo ✓ Deployed service is healthy
        ) else (
            echo ⚠ WARNING: Deployed service health check failed
        )
        del final_url.txt
    )

    echo.
    echo To view logs: gcloud run services logs tail vibematch-ai --region=europe-west9
    echo To view service: gcloud run services describe vibematch-ai --region=europe-west9
) else (
    echo.
    echo ========================================
    echo         DEPLOYMENT FAILED! ❌
    echo ========================================
    echo.
    echo Check the Cloud Build logs for details:
    echo https://console.cloud.google.com/cloud-build/builds?project=vibematch-ai
    echo.
    echo Your current service should still be running at: https://vibematch.tech
)

echo.
pause