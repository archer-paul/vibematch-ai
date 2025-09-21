Write-Host "Creating minimal deployment folder..." -ForegroundColor Yellow

# Create deploy folder
if (Test-Path "vibematch-deploy") {
    Remove-Item -Recurse -Force "vibematch-deploy"
}
New-Item -ItemType Directory -Path "vibematch-deploy"

# Copy only essential files
Copy-Item "package.json" "vibematch-deploy/"
Copy-Item "package-lock.json" "vibematch-deploy/" -ErrorAction SilentlyContinue
Copy-Item "Dockerfile" "vibematch-deploy/"
Copy-Item "server.js" "vibematch-deploy/"
Copy-Item "cloudbuild-simple.yaml" "vibematch-deploy/cloudbuild.yaml"
Copy-Item ".env" "vibematch-deploy/" -ErrorAction SilentlyContinue

# Copy source code (without node_modules)
Copy-Item "src" "vibematch-deploy/src" -Recurse
Copy-Item "public" "vibematch-deploy/public" -Recurse -ErrorAction SilentlyContinue
Copy-Item "index.html" "vibematch-deploy/" -ErrorAction SilentlyContinue

# Copy config files
Copy-Item "vite.config.ts" "vibematch-deploy/" -ErrorAction SilentlyContinue
Copy-Item "tsconfig*.json" "vibematch-deploy/" -ErrorAction SilentlyContinue
Copy-Item "tailwind.config.ts" "vibematch-deploy/" -ErrorAction SilentlyContinue
Copy-Item "tailwind.config.js" "vibematch-deploy/" -ErrorAction SilentlyContinue
Copy-Item "postcss.config.js" "vibematch-deploy/" -ErrorAction SilentlyContinue
Copy-Item "components.json" "vibematch-deploy/" -ErrorAction SilentlyContinue

# Verify Express is in dependencies
$packageContent = Get-Content "vibematch-deploy/package.json" -Raw
if ($packageContent -notmatch '"express"') {
    Write-Host "Adding Express to dependencies..." -ForegroundColor Yellow
    $packageContent = $packageContent -replace '("dependencies": \{)', '$1`n    "express": "^4.18.2",'
    Set-Content "vibematch-deploy/package.json" $packageContent
}

Write-Host "Deploy folder created! Files:" -ForegroundColor Green
Get-ChildItem "vibematch-deploy" -Recurse | Measure-Object | Select-Object Count
Write-Host "Now run: cd vibematch-deploy && gcloud builds submit" -ForegroundColor Cyan