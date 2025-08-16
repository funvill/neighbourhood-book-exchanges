# Automated Project Cleanup Script
# Removes temporary files, migration scripts, backups, and other unnecessary files

Write-Host "Starting automated project cleanup..." -ForegroundColor Cyan

$projectRoot = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges"
$removedCount = 0
$errorCount = 0

# List of items to remove (relative paths)
$itemsToRemove = @(
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
    
    # Migration scripts
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

foreach ($relativePath in $itemsToRemove) {
    $fullPath = Join-Path $projectRoot $relativePath
    
    if (Test-Path $fullPath) {
        try {
            if (Test-Path $fullPath -PathType Container) {
                Remove-Item $fullPath -Recurse -Force
                Write-Host "✓ Removed directory: $relativePath" -ForegroundColor Green
            } else {
                Remove-Item $fullPath -Force  
                Write-Host "✓ Removed file: $relativePath" -ForegroundColor Green
            }
            $removedCount++
        } catch {
            Write-Host "✗ Failed to remove: $relativePath - $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "○ Not found: $relativePath" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Cleanup Summary:" -ForegroundColor Cyan
Write-Host "  Removed: $removedCount items" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "  Errors: $errorCount items" -ForegroundColor Red
}
Write-Host "Project cleanup completed!" -ForegroundColor Cyan
