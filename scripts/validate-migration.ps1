# Migration Validation Script
# Validates data integrity after migration
# Usage: ./validate-migration.ps1

Write-Host "=== Migration Validation Script ===" -ForegroundColor Green

$errors = 0
$warnings = 0

# Function to validate a markdown file's frontmatter
function Test-MarkdownFrontmatter {
    param($FilePath)
    
    try {
        $content = Get-Content $FilePath -Raw
        
        # Check for frontmatter block
        if ($content -notmatch "^---\s*\r?\n.*\r?\n---") {
            Write-Warning "Missing or invalid frontmatter in: $FilePath"
            return $false
        }
        
        # Extract frontmatter
        $frontmatterMatch = [regex]::Match($content, "^---\s*\r?\n(.*?)\r?\n---", [System.Text.RegularExpressions.RegexOptions]::Singleline)
        if (-not $frontmatterMatch.Success) {
            Write-Warning "Could not parse frontmatter in: $FilePath"
            return $false
        }
        
        $frontmatter = $frontmatterMatch.Groups[1].Value
        
        # Check required fields
        $requiredFields = @("title", "library_id")
        foreach ($field in $requiredFields) {
            if ($frontmatter -notmatch "$field:\s*\S+") {
                Write-Warning "Missing required field '$field' in: $FilePath"
                return $false
            }
        }
        
        return $true
    }
    catch {
        Write-Error "Error validating $FilePath`: $($_.Exception.Message)"
        return $false
    }
}

# Validate flattened libraries
Write-Host "Validating flattened library structure..." -ForegroundColor Cyan

$librariesDir = "content/libraries"
if (Test-Path $librariesDir) {
    $libraryFiles = Get-ChildItem -Path $librariesDir -Filter "*.md" -File
    
    Write-Host "Found $($libraryFiles.Count) library files" -ForegroundColor Cyan
    
    $validLibraries = 0
    foreach ($file in $libraryFiles) {
        if (Test-MarkdownFrontmatter $file.FullName) {
            $validLibraries++
        } else {
            $errors++
        }
    }
    
    Write-Host "Valid libraries: $validLibraries/$($libraryFiles.Count)" -ForegroundColor $(if ($validLibraries -eq $libraryFiles.Count) { 'Green' } else { 'Yellow' })
} else {
    Write-Error "Libraries directory not found: $librariesDir"
    $errors++
}

# Validate logbook structure
Write-Host "Validating logbook structure..." -ForegroundColor Cyan

$logbooksDir = "content/logbooks"
if (Test-Path $logbooksDir) {
    $logbookDirs = Get-ChildItem -Path $logbooksDir -Directory
    
    Write-Host "Found $($logbookDirs.Count) logbook directories" -ForegroundColor Cyan
    
    $totalLogbookEntries = 0
    $validLogbookEntries = 0
    
    foreach ($dir in $logbookDirs) {
        $logbookFiles = Get-ChildItem -Path $dir.FullName -Filter "*.md" -File
        $totalLogbookEntries += $logbookFiles.Count
        
        foreach ($file in $logbookFiles) {
            if (Test-MarkdownFrontmatter $file.FullName) {
                $validLogbookEntries++
            } else {
                $errors++
            }
        }
    }
    
    Write-Host "Valid logbook entries: $validLogbookEntries/$totalLogbookEntries" -ForegroundColor $(if ($validLogbookEntries -eq $totalLogbookEntries) { 'Green' } else { 'Yellow' })
} else {
    Write-Warning "Logbooks directory not found: $logbooksDir (may not be created yet)"
    $warnings++
}

# Validate public images structure
Write-Host "Validating public images structure..." -ForegroundColor Cyan

$publicImagesDir = "public/images/libraries"
if (Test-Path $publicImagesDir) {
    $imageDirs = Get-ChildItem -Path $publicImagesDir -Directory
    
    Write-Host "Found $($imageDirs.Count) image directories" -ForegroundColor Cyan
    
    $totalImages = 0
    foreach ($dir in $imageDirs) {
        $imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.webp", "*.avif", "*.gif")
        foreach ($ext in $imageExtensions) {
            $images = Get-ChildItem -Path $dir.FullName -Filter $ext -File
            $totalImages += $images.Count
        }
    }
    
    Write-Host "Total images in public directory: $totalImages" -ForegroundColor Cyan
} else {
    Write-Warning "Public images directory not found: $publicImagesDir (may not be created yet)"
    $warnings++
}

# Check for orphaned folders
Write-Host "Checking for orphaned content..." -ForegroundColor Cyan

if (Test-Path "content/libraries") {
    $orphanedFolders = Get-ChildItem -Path "content/libraries" -Directory
    if ($orphanedFolders.Count -gt 0) {
        Write-Warning "Found $($orphanedFolders.Count) orphaned library folders that should be migrated or removed:"
        foreach ($folder in $orphanedFolders) {
            Write-Host "  - $($folder.Name)" -ForegroundColor Yellow
        }
        $warnings++
    } else {
        Write-Host "No orphaned library folders found" -ForegroundColor Green
    }
}

# Validate library ID consistency
Write-Host "Validating library ID consistency..." -ForegroundColor Cyan

$libraryIds = @{}
if (Test-Path $librariesDir) {
    $libraryFiles = Get-ChildItem -Path $librariesDir -Filter "*.md" -File
    
    foreach ($file in $libraryFiles) {
        try {
            $content = Get-Content $file.FullName -Raw
            if ($content -match "library_id:\s*(\d+)") {
                $libraryId = $matches[1]
                
                if ($libraryIds.ContainsKey($libraryId)) {
                    Write-Error "Duplicate library_id $libraryId found in: $($file.Name) and $($libraryIds[$libraryId])"
                    $errors++
                } else {
                    $libraryIds[$libraryId] = $file.Name
                }
            }
        }
        catch {
            Write-Warning "Could not validate library_id in: $($file.Name)"
            $warnings++
        }
    }
}

Write-Host "Unique library IDs: $($libraryIds.Count)" -ForegroundColor Cyan

# Summary
Write-Host "=== Validation Summary ===" -ForegroundColor Green
Write-Host "Errors: $errors" -ForegroundColor $(if ($errors -gt 0) { 'Red' } else { 'Green' })
Write-Host "Warnings: $warnings" -ForegroundColor $(if ($warnings -gt 0) { 'Yellow' } else { 'Green' })

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "Migration validation passed successfully!" -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "Migration validation completed with warnings" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "Migration validation failed with errors" -ForegroundColor Red
    exit 1
}