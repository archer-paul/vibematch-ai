Write-Host "VibeMatch.tech - Simple Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "Setting project..." -ForegroundColor Yellow
gcloud config set project vibematch-ai

Write-Host "Starting Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --config=cloudbuild.yaml .

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Check your site at: https://vibematch.tech" -ForegroundColor Cyan