# Fix photo paths in library content files
$contentDir = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges\content\libraries"
$libraryImagesDir = "C:\Users\funvill\Documents\git\neighbourhood-book-exchanges\public\library-images"

Write-Host "Starting photo path fix..."

$libraryFiles = Get-ChildItem -Path $contentDir -Filter "*.md"
$fixedCount = 0
$skippedCount = 0

foreach ($file in $libraryFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    if ($content -match "photo:\s*logbook/") {
        $libraryId = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        Write-Host "Processing $($file.Name) - Library ID: $libraryId"
        
        $possibleDirs = Get-ChildItem -Path $libraryImagesDir -Directory | Where-Object { $_.Name -like "$libraryId*" }
        
        if ($possibleDirs.Count -eq 1) {
            $targetDir = $possibleDirs[0].Name
            $newContent = $content -replace "photo:\s*logbook/", "photo: /library-images/$targetDir/"
            
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
            $fixedCount++
        } else {
            Write-Host "  Skipped: $($file.Name) - Could not determine target directory" -ForegroundColor Yellow
            $skippedCount++
        }
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "Fixed: $fixedCount files" -ForegroundColor Green
Write-Host "Skipped: $skippedCount files" -ForegroundColor Yellow
Write-Host "Done!" -ForegroundColor Cyan
