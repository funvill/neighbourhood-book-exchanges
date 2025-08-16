# Enhanced photo path fixing script
$contentDir = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges\content\libraries"
$libraryImagesDir = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges\public\library-images"

Write-Host "Starting enhanced photo path fix..."

$libraryFiles = Get-ChildItem -Path $contentDir -Filter "*.md"
$fixedCount = 0
$skippedCount = 0

foreach ($file in $libraryFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    if ($content -match "photo:\s*logbook/(.+)") {
        $imageName = $matches[1].Trim()
        $libraryId = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        
        Write-Host "Processing $($file.Name) - Library ID: $libraryId, Image: $imageName"
        
        $possibleDirs = Get-ChildItem -Path $libraryImagesDir -Directory | Where-Object { $_.Name -like "$libraryId*" }
        
        $targetDir = $null
        
        if ($possibleDirs.Count -eq 1) {
            $targetDir = $possibleDirs[0].Name
        } elseif ($possibleDirs.Count -gt 1) {
            # Multiple directories - check which one contains the image
            foreach ($dir in $possibleDirs) {
                $imagePath = Join-Path $libraryImagesDir "$($dir.Name)\$imageName"
                if (Test-Path $imagePath) {
                    $targetDir = $dir.Name
                    break
                }
            }
            
            # If still not found, use the first directory as fallback
            if (-not $targetDir) {
                $targetDir = $possibleDirs[0].Name
                Write-Host "  Using first directory as fallback: $targetDir" -ForegroundColor Yellow
            }
        }
        
        if ($targetDir) {
            $newContent = $content -replace "photo:\s*logbook/.+", "photo: /library-images/$targetDir/$imageName"
            
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "  Fixed: $($file.Name) -> /library-images/$targetDir/$imageName" -ForegroundColor Green
            $fixedCount++
        } else {
            Write-Host "  Skipped: $($file.Name) - No directory found for $libraryId" -ForegroundColor Red
            $skippedCount++
        }
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "Fixed: $fixedCount files" -ForegroundColor Green
Write-Host "Skipped: $skippedCount files" -ForegroundColor Yellow
Write-Host "Done!" -ForegroundColor Cyan
