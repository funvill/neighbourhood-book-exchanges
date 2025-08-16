# Migration Script: Move Images to Public Folder
# Migrates from content/libraries/*/photos/ to public/images/libraries/*/
# Usage: ./migrate-images.ps1 [-DryRun]

param(
    [switch]$DryRun = $false
)

Write-Host "=== Image Migration Script ===" -ForegroundColor Green
Write-Host "Dry Run Mode: $DryRun" -ForegroundColor Yellow

$librariesDir = "content/libraries"
$publicImagesDir = "public/images/libraries"
$backupDir = "backup/images-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"

if (-not (Test-Path $librariesDir)) {
    Write-Error "Libraries directory not found: $librariesDir"
    exit 1
}

# Create public images and backup directories
if (-not $DryRun) {
    if (-not (Test-Path $publicImagesDir)) {
        New-Item -ItemType Directory -Path $publicImagesDir -Force | Out-Null
        Write-Host "Created public images directory: $publicImagesDir" -ForegroundColor Cyan
    }
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Write-Host "Created backup directory: $backupDir" -ForegroundColor Cyan
    }
}

$libraryFolders = Get-ChildItem -Path $librariesDir -Directory
$processed = 0
$errors = 0
$totalImages = 0

foreach ($folder in $libraryFolders) {
    $indexPath = Join-Path $folder.FullName "index.md"
    $photosPath = Join-Path $folder.FullName "photos"
    
    if (-not (Test-Path $indexPath)) {
        Write-Warning "Skipping $($folder.Name): No index.md found"
        continue
    }
    
    try {
        # Read the index.md file to get library_id
        $content = Get-Content $indexPath -Raw
        
        if ($content -match "library_id:\s*(\d+)") {
            $libraryId = $matches[1]
        } else {
            Write-Warning "No library_id found in $($folder.Name), skipping"
            continue
        }
        
        # Check for any image files in the folder (not just photos subfolder)
        $imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.webp", "*.avif", "*.gif")
        $allImages = @()
        
        # Check root folder for images
        foreach ($ext in $imageExtensions) {
            $images = Get-ChildItem -Path $folder.FullName -Filter $ext -File
            $allImages += $images
        }
        
        # Check photos subfolder if it exists
        if (Test-Path $photosPath) {
            foreach ($ext in $imageExtensions) {
                $images = Get-ChildItem -Path $photosPath -Filter $ext -File
                $allImages += $images
            }
        }
        
        if ($allImages.Count -eq 0) {
            Write-Host "No images found for $($folder.Name)" -ForegroundColor Gray
            continue
        }
        
        # Create target directory for this library's images
        $targetImageDir = Join-Path $publicImagesDir $libraryId
        
        Write-Host "Processing images: $($folder.Name) -> public/images/libraries/$libraryId ($($allImages.Count) images)" -ForegroundColor Cyan
        
        if (-not $DryRun) {
            # Create target directory
            if (-not (Test-Path $targetImageDir)) {
                New-Item -ItemType Directory -Path $targetImageDir -Force | Out-Null
            }
            
            # Backup original images
            $backupImagePath = Join-Path $backupDir "$($folder.Name)-images"
            New-Item -ItemType Directory -Path $backupImagePath -Force | Out-Null
        }
        
        # Process each image
        foreach ($image in $allImages) {
            try {
                # Normalize filename (lowercase, no spaces)
                $normalizedName = $image.Name.ToLower() -replace '\s+', '-'
                $targetImagePath = Join-Path $targetImageDir $normalizedName
                
                if (-not $DryRun) {
                    # Backup original
                    $backupImageFilePath = Join-Path $backupImagePath $image.Name
                    Copy-Item -Path $image.FullName -Destination $backupImageFilePath -Force
                    
                    # Copy to public directory
                    Copy-Item -Path $image.FullName -Destination $targetImagePath -Force
                    Write-Host "  Migrated: $($image.Name) -> $normalizedName" -ForegroundColor Green
                } else {
                    Write-Host "  [DRY RUN] Would migrate: $($image.Name) -> $normalizedName" -ForegroundColor Yellow
                }
                
                $totalImages++
            }
            catch {
                Write-Error "Error processing image $($image.Name): $($_.Exception.Message)"
                $errors++
            }
        }
        
        $processed++
    }
    catch {
        Write-Error "Error processing $($folder.Name): $($_.Exception.Message)"
        $errors++
    }
}

Write-Host "=== Image Migration Summary ===" -ForegroundColor Green
Write-Host "Processed: $processed libraries" -ForegroundColor Cyan
Write-Host "Total images: $totalImages" -ForegroundColor Cyan
Write-Host "Errors: $errors" -ForegroundColor $(if ($errors -gt 0) { 'Red' } else { 'Green' })

if (-not $DryRun) {
    Write-Host "Backup created at: $backupDir" -ForegroundColor Cyan
    Write-Host "Next step: Update image references in content files" -ForegroundColor Yellow
    Write-Host "Note: Update photo paths from relative to absolute: /images/libraries/$libraryId/filename" -ForegroundColor Yellow
} else {
    Write-Host "Run without -DryRun to execute migration" -ForegroundColor Yellow
}