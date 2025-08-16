# Fix photo paths in library content files
# This script corrects photo paths that incorrectly reference "logbook/" 
# and updates them to point to the correct library-images directory

$contentDir = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges\content\libraries"
$libraryImagesDir = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges\public\library-images"

Write-Host "Starting photo path fix..."

# Get all markdown files in the libraries directory
$libraryFiles = Get-ChildItem -Path $contentDir -Filter "*.md"

$fixedCount = 0
$skippedCount = 0

foreach ($file in $libraryFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if file contains "photo: logbook/"
    if ($content -match "photo:\s*logbook/([^\n\r]+)") {
        $imageName = $matches[1].Trim()
        
        # Extract library ID from filename (e.g., "00020.md" -> "00020")
        $libraryId = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        
        Write-Host "Processing $($file.Name) - Library ID: $libraryId, Image: $imageName"
        
        # Find matching directory in library-images
        $possibleDirs = Get-ChildItem -Path $libraryImagesDir -Directory | Where-Object { $_.Name -like "$libraryId*" }
        
        if ($possibleDirs.Count -eq 1) {
            $targetDir = $possibleDirs[0].Name
            $newPhotoPath = "/library-images/$targetDir/$imageName"
            
            # Check if the image actually exists
            $imagePath = Join-Path $libraryImagesDir "$targetDir\$imageName"
            if (Test-Path $imagePath) {
                # Replace the photo path in the content
                $newContent = $content -replace "photo:\s*logbook/([^\n\r]+)", "photo: $newPhotoPath"
                
                Set-Content -Path $file.FullName -Value $newContent -NoNewline
                Write-Host "  ✓ Fixed: $($file.Name) -> $newPhotoPath" -ForegroundColor Green
                $fixedCount++
            } else {
                Write-Host "  ⚠ Image not found: $imagePath" -ForegroundColor Yellow
                $skippedCount++
            }
        } elseif ($possibleDirs.Count -gt 1) {
            Write-Host "  ⚠ Multiple directories found for $libraryId : $($possibleDirs.Name -join ', ')" -ForegroundColor Yellow
            $skippedCount++
        } else {
            Write-Host "  ⚠ No directory found for $libraryId" -ForegroundColor Yellow
            $skippedCount++
        }
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "Fixed: $fixedCount files" -ForegroundColor Green
Write-Host "Skipped: $skippedCount files" -ForegroundColor Yellow
Write-Host "Done!" -ForegroundColor Cyan
