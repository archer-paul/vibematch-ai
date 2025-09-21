Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   VibeMatch.tech - Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed and authenticated
Write-Host "[1/6] Checking Google Cloud CLI..." -ForegroundColor Yellow
try {
    $authList = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
    if (-not $authList) {
        Write-Host "ERROR: You are not authenticated with Google Cloud CLI" -ForegroundColor Red
        Write-Host "Please run: gcloud auth login" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}
catch {
    Write-Host "ERROR: gcloud CLI not found or not working" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Set project
Write-Host "[2/6] Setting project to vibematch-ai..." -ForegroundColor Yellow
gcloud config set project vibematch-ai

# Check if Cloud Build API is enabled
Write-Host "[3/6] Checking if Cloud Build API is enabled..." -ForegroundColor Yellow
$buildApi = gcloud services list --enabled --filter="name:cloudbuild.googleapis.com" --format="value(name)" 2>$null
if (-not $buildApi) {
    Write-Host "Enabling Cloud Build API..." -ForegroundColor Yellow
    gcloud services enable cloudbuild.googleapis.com
    Write-Host "Waiting for API to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

# Check current service status
Write-Host "[4/6] Checking current service status..." -ForegroundColor Yellow
$currentUrl = gcloud run services describe vibematch-ai --region=europe-west9 --format="value(status.url)" 2>$null
if ($currentUrl) {
    Write-Host "Current service URL: $currentUrl" -ForegroundColor Green

    # Test current service
    Write-Host "Testing current service health..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$currentUrl/health" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Current service is healthy" -ForegroundColor Green
        }
        else {
            Write-Host "⚠ WARNING: Current service health check failed" -ForegroundColor Yellow
            $continue = Read-Host "Continue with deployment? (y/N)"
            if ($continue -ne "y" -and $continue -ne "Y") {
                Write-Host "Deployment cancelled" -ForegroundColor Yellow
                Read-Host "Press Enter to exit"
                exit 1
            }
        }
    }
    catch {
        Write-Host "⚠ WARNING: Current service health check failed" -ForegroundColor Yellow
        $continue = Read-Host "Continue with deployment? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Host "Deployment cancelled" -ForegroundColor Yellow
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
}
else {
    Write-Host "No existing service found - this will be a new deployment" -ForegroundColor Yellow
}

# Get commit information for build description
Write-Host "[5/6] Getting current commit information..." -ForegroundColor Yellow
try {
    $commitSha = git rev-parse --short HEAD 2>$null
    $commitMsg = git log -1 --pretty=format:"%s" 2>$null
    if ($commitSha) {
        $buildDesc = "Deploy commit $commitSha`: $commitMsg"
    }
    else {
        $buildDesc = "Manual deployment"
    }
}
catch {
    $buildDesc = "Manual deployment"
}

Write-Host "Build description: $buildDesc" -ForegroundColor Cyan

# Start Cloud Build
Write-Host "[6/6] Starting Cloud Build deployment..." -ForegroundColor Yellow
Write-Host "This will:" -ForegroundColor Cyan
Write-Host "  - Build your Docker image in the cloud" -ForegroundColor Cyan
Write-Host "  - Deploy with zero-downtime (gradual traffic switch)" -ForegroundColor Cyan
Write-Host "  - Maintain your domain vibematch.tech" -ForegroundColor Cyan
Write-Host "  - Keep all environment variables" -ForegroundColor Cyan
Write-Host ""

gcloud builds submit --config=cloudbuild.yaml .

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "        DEPLOYMENT SUCCESSFUL! 🚀" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site is live at: https://vibematch.tech" -ForegroundColor Green
    Write-Host ""
    Write-Host "Checking final service status..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    $finalUrl = gcloud run services describe vibematch-ai --region=europe-west9 --format="value(status.url)" 2>$null
    if ($finalUrl) {
        Write-Host "Service URL: $finalUrl" -ForegroundColor Green

        Write-Host "Testing deployed service..." -ForegroundColor Yellow
        try {
            $response = Invoke-WebRequest -Uri "$finalUrl/health" -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Deployed service is healthy" -ForegroundColor Green
            }
            else {
                Write-Host "⚠ WARNING: Deployed service health check failed" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "⚠ WARNING: Deployed service health check failed" -ForegroundColor Yellow
        }
    }

    Write-Host ""
    Write-Host "To view logs: gcloud run services logs tail vibematch-ai --region=europe-west9" -ForegroundColor Cyan
    Write-Host "To view service: gcloud run services describe vibematch-ai --region=europe-west9" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "         DEPLOYMENT FAILED! ❌" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the Cloud Build logs for details:" -ForegroundColor Yellow
    Write-Host "https://console.cloud.google.com/cloud-build/builds?project=vibematch-ai" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your current service should still be running at: https://vibematch.tech" -ForegroundColor Green
}

Write-Host ""
Read-Host "Press Enter to exit"