# Project Cleanup Script
# Removes temporary files, migration scripts, backups, and other unnecessary files

Write-Host "Starting project cleanup..." -ForegroundColor Cyan

$projectRoot = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges"
$itemsToRemove = @()

# Check if items exist before adding to removal list
$pathsToCheck = @(
    # Backup directories (all migration backups)
    "backup",
    
    # Migration and temporary files
    "MIGRATION-DOCUMENTATION.md",
    ".library-id-counter.json",
    
    # Build output directories
    ".nuxt",
    ".output",
    "dist",
    ".wrangler",
    ".data",
    
    # Migration scripts in scripts directory
    "scripts\migrate-libraries.ps1",
    "scripts\migrate-libraries.sh", 
    "scripts\migrate-logbooks.ps1",
    "scripts\migrate-logbooks.sh",
    "scripts\migrate-images.ps1",
    "scripts\cleanup-old-structure.sh",
    "scripts\copy-library-images.js",
    "scripts\copy-library-images.mjs",
    "scripts\maintenance_copy-library-images.mjs",
    "scripts\maintenance_jpg_to_png.mjs",
    "scripts\maintenance_png_resize.mjs",
    "scripts\import-kml.js",
    "scripts\assign-library-ids.mjs",
    "scripts\remove-next-steps-from-logbooks.js",
    "scripts\validate-migration.ps1",
    "scripts\validate-migration.sh",
    "scripts\test-performance.sh",
    
    # Photo path fix scripts (temporary)
    "scripts\fix-photo-paths.ps1",
    "scripts\fix-photo-paths-simple.ps1",
    "scripts\fix-photo-paths-enhanced.ps1"
)

foreach ($relativePath in $pathsToCheck) {
    $fullPath = Join-Path $projectRoot $relativePath
    if (Test-Path $fullPath) {
        $itemsToRemove += $fullPath
    }
}

if ($itemsToRemove.Count -eq 0) {
    Write-Host "No cleanup items found." -ForegroundColor Green
    return
}

Write-Host "Found $($itemsToRemove.Count) items to remove:" -ForegroundColor Yellow
foreach ($item in $itemsToRemove) {
    $relativePath = $item.Replace($projectRoot + "\", "")
    Write-Host "  - $relativePath" -ForegroundColor Gray
}

Write-Host ""
$confirmation = Read-Host "Do you want to proceed with cleanup? (y/N)"

if ($confirmation -eq "y" -or $confirmation -eq "Y") {
    $removedCount = 0
    $errorCount = 0
    
    foreach ($item in $itemsToRemove) {
        try {
            $relativePath = $item.Replace($projectRoot + "\", "")
            
            if (Test-Path $item -PathType Container) {
                Remove-Item $item -Recurse -Force
                Write-Host "  ✓ Removed directory: $relativePath" -ForegroundColor Green
            } else {
                Remove-Item $item -Force
                Write-Host "  ✓ Removed file: $relativePath" -ForegroundColor Green
            }
            $removedCount++
        } catch {
            Write-Host "  ✗ Failed to remove: $relativePath - $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    }
    
    Write-Host ""
    Write-Host "Cleanup Summary:" -ForegroundColor Cyan
    Write-Host "  Removed: $removedCount items" -ForegroundColor Green
    if ($errorCount -gt 0) {
        Write-Host "  Errors: $errorCount items" -ForegroundColor Red
    }
    Write-Host "Project cleanup completed!" -ForegroundColor Cyan
} else {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
}
