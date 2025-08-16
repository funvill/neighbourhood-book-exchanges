# Migration Script: Flatten Library Structure
# Migrates from content/libraries/*/index.md to content/libraries/*.md
# Usage: ./migrate-libraries.ps1 [-DryRun]

param(
    [switch]$DryRun = $false
)

Write-Host "=== Library Migration Script ===" -ForegroundColor Green
Write-Host "Dry Run Mode: $DryRun" -ForegroundColor Yellow

$librariesDir = "content/libraries"
$backupDir = "backup/libraries-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"

if (-not (Test-Path $librariesDir)) {
    Write-Error "Libraries directory not found: $librariesDir"
    exit 1
}

# Create backup directory
if (-not $DryRun -and -not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "Created backup directory: $backupDir" -ForegroundColor Cyan
}

$libraryFolders = Get-ChildItem -Path $librariesDir -Directory
$processed = 0
$errors = 0

foreach ($folder in $libraryFolders) {
    $indexPath = Join-Path $folder.FullName "index.md"
    
    if (-not (Test-Path $indexPath)) {
        Write-Warning "Skipping $($folder.Name): No index.md found"
        continue
    }
    
    try {
        # Read the index.md file
        $content = Get-Content $indexPath -Raw
        
        # Extract library_id from frontmatter
        if ($content -match "library_id:\s*(\d+)") {
            $libraryId = $matches[1]
        } else {
            Write-Warning "No library_id found in $($folder.Name), skipping"
            continue
        }
        
        # Create new filename: library_id-slug.md
        $newFilename = "$libraryId.md"
        $newPath = Join-Path $librariesDir $newFilename
        
        Write-Host "Processing: $($folder.Name) -> $newFilename" -ForegroundColor Cyan
        
        if (-not $DryRun) {
            # Backup original folder
            $backupFolderPath = Join-Path $backupDir $folder.Name
            Copy-Item -Path $folder.FullName -Destination $backupFolderPath -Recurse -Force
            
            # Write flattened file
            Set-Content -Path $newPath -Value $content -Encoding UTF8
            
            Write-Host "  Created: $newPath" -ForegroundColor Green
        } else {
            Write-Host "  [DRY RUN] Would create: $newPath" -ForegroundColor Yellow
        }
        
        $processed++
    }
    catch {
        Write-Error "Error processing $($folder.Name): $($_.Exception.Message)"
        $errors++
    }
}

Write-Host "=== Migration Summary ===" -ForegroundColor Green
Write-Host "Processed: $processed libraries" -ForegroundColor Cyan
Write-Host "Errors: $errors" -ForegroundColor $(if ($errors -gt 0) { 'Red' } else { 'Green' })

if (-not $DryRun) {
    Write-Host "Backup created at: $backupDir" -ForegroundColor Cyan
    Write-Host "Next step: Run migrate-logbooks.ps1" -ForegroundColor Yellow
} else {
    Write-Host "Run without -DryRun to execute migration" -ForegroundColor Yellow
}