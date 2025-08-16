#!/bin/bash
# Cleanup script to remove old directory structure after successful migration
# Usage: ./cleanup-old-structure.sh [--dry-run]

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
fi

echo "=== Migration Cleanup Script ==="
echo "Dry Run Mode: $DRY_RUN"

LIBRARIES_DIR="content/libraries"

# Verify new structure exists first
echo "Verifying new structure..."

new_files=$(ls "$LIBRARIES_DIR"/*.md 2>/dev/null | wc -l)
if [[ $new_files -ne 519 ]]; then
    echo "✗ Expected 519 library files, found $new_files"
    echo "  Aborting cleanup - new structure not complete"
    exit 1
fi

logbook_dirs=$(ls content/logbooks/ 2>/dev/null | wc -l)
if [[ $logbook_dirs -ne 519 ]]; then
    echo "✗ Expected 519 logbook directories, found $logbook_dirs"  
    echo "  Aborting cleanup - logbook migration not complete"
    exit 1
fi

echo "✓ New structure verified (519 libraries, 519 logbook dirs)"

# Count old directories to remove
old_dirs=$(find "$LIBRARIES_DIR" -mindepth 1 -type d | wc -l)
echo "Found $old_dirs old library directories to remove"

if [[ $old_dirs -eq 0 ]]; then
    echo "✓ No old directories found - cleanup already complete"
    exit 0
fi

if [[ "$DRY_RUN" == "true" ]]; then
    echo ""
    echo "Directories that would be removed:"
    find "$LIBRARIES_DIR" -mindepth 1 -type d | head -10
    if [[ $old_dirs -gt 10 ]]; then
        echo "... and $((old_dirs - 10)) more"
    fi
    echo ""
    echo "Run without --dry-run to execute cleanup"
    exit 0
fi

# Verify backups exist
backup_libs=$(ls backup/libraries-*/00001-* 2>/dev/null | wc -l)
backup_logbooks=$(ls backup/logbooks-*/00001-* 2>/dev/null | wc -l)

if [[ $backup_libs -eq 0 || $backup_logbooks -eq 0 ]]; then
    echo "⚠ Warning: Backup directories not found"
    echo "  Libraries backup: $backup_libs"
    echo "  Logbooks backup: $backup_logbooks"
    echo ""
    read -p "Continue without verified backups? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleanup aborted"
        exit 1
    fi
else
    echo "✓ Backup verification: found library and logbook backups"
fi

# Perform cleanup
echo ""
echo "Removing old directory structure..."

removed=0
errors=0

for dir in "$LIBRARIES_DIR"/*/; do
    if [[ -d "$dir" ]]; then
        dir_name=$(basename "$dir")
        echo -n "Removing $dir_name... "
        
        if rm -rf "$dir"; then
            echo "✓"
            ((removed++))
        else
            echo "✗"
            ((errors++))
        fi
    fi
done

echo ""
echo "=== Cleanup Summary ==="
echo "Removed: $removed directories"
echo "Errors: $errors"

if [[ $errors -eq 0 ]]; then
    echo "✓ Cleanup completed successfully!"
    echo ""
    echo "Final structure:"
    echo "  Libraries: $(ls "$LIBRARIES_DIR"/*.md | wc -l) files"
    echo "  Logbooks: $(ls content/logbooks/ | wc -l) directories"
    echo "  Old dirs: $(find "$LIBRARIES_DIR" -mindepth 1 -type d | wc -l) remaining"
else
    echo "⚠ Cleanup completed with $errors errors"
fi