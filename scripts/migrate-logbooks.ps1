# Migration Script: Reorganize Logbook Entries
# Migrates from content/libraries/*/logbook/ to content/logbooks/*/
# Usage: ./migrate-logbooks.ps1 [-DryRun]

param(
    [switch]$DryRun = $false
)

Write-Host "=== Logbook Migration Script ===" -ForegroundColor Green
Write-Host "Dry Run Mode: $DryRun" -ForegroundColor Yellow

$librariesDir = "content/libraries"
$logbooksDir = "content/logbooks"
$backupDir = "backup/logbooks-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"

if (-not (Test-Path $librariesDir)) {
    Write-Error "Libraries directory not found: $librariesDir"
    exit 1
}

# Create logbooks and backup directories
if (-not $DryRun) {
    if (-not (Test-Path $logbooksDir)) {
        New-Item -ItemType Directory -Path $logbooksDir -Force | Out-Null
        Write-Host "Created logbooks directory: $logbooksDir" -ForegroundColor Cyan
    }
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Write-Host "Created backup directory: $backupDir" -ForegroundColor Cyan
    }
}

$libraryFolders = Get-ChildItem -Path $librariesDir -Directory
$processed = 0
$errors = 0
$totalEntries = 0

foreach ($folder in $libraryFolders) {
    $indexPath = Join-Path $folder.FullName "index.md"
    $logbookPath = Join-Path $folder.FullName "logbook"
    
    if (-not (Test-Path $indexPath)) {
        Write-Warning "Skipping $($folder.Name): No index.md found"
        continue
    }
    
    if (-not (Test-Path $logbookPath)) {
        Write-Host "No logbook for $($folder.Name)" -ForegroundColor Gray
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
        
        # Create target directory for this library's logbook
        $targetLogbookDir = Join-Path $logbooksDir $libraryId
        
        Write-Host "Processing logbook: $($folder.Name) -> logbooks/$libraryId" -ForegroundColor Cyan
        
        if (-not $DryRun) {
            # Backup original logbook
            $backupLogbookPath = Join-Path $backupDir "$($folder.Name)-logbook"
            Copy-Item -Path $logbookPath -Destination $backupLogbookPath -Recurse -Force
            
            # Create target directory
            if (-not (Test-Path $targetLogbookDir)) {
                New-Item -ItemType Directory -Path $targetLogbookDir -Force | Out-Null
            }
        }
        
        # Process logbook entries
        $logbookEntries = Get-ChildItem -Path $logbookPath -Filter "*.md"
        foreach ($entry in $logbookEntries) {
            $targetEntryPath = Join-Path $targetLogbookDir $entry.Name
            
            try {
                # Read and update logbook entry
                $entryContent = Get-Content $entry.FullName -Raw
                
                # Add library_id to frontmatter if not present
                if ($entryContent -notmatch "library_id:") {
                    # Insert library_id after the opening ---
                    $entryContent = $entryContent -replace "^(---\s*\r?\n)", "`$1library_id: $libraryId`r`n"
                }
                
                if (-not $DryRun) {
                    Set-Content -Path $targetEntryPath -Value $entryContent -Encoding UTF8
                    Write-Host "  Migrated: $($entry.Name)" -ForegroundColor Green
                } else {
                    Write-Host "  [DRY RUN] Would migrate: $($entry.Name)" -ForegroundColor Yellow
                }
                
                $totalEntries++
            }
            catch {
                Write-Error "Error processing logbook entry $($entry.Name): $($_.Exception.Message)"
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

Write-Host "=== Logbook Migration Summary ===" -ForegroundColor Green
Write-Host "Processed: $processed library logbooks" -ForegroundColor Cyan
Write-Host "Total entries: $totalEntries" -ForegroundColor Cyan
Write-Host "Errors: $errors" -ForegroundColor $(if ($errors -gt 0) { 'Red' } else { 'Green' })

if (-not $DryRun) {
    Write-Host "Backup created at: $backupDir" -ForegroundColor Cyan
    Write-Host "Next step: Run migrate-images.ps1" -ForegroundColor Yellow
} else {
    Write-Host "Run without -DryRun to execute migration" -ForegroundColor Yellow
}