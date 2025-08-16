#!/bin/bash
# Validation script to verify migration success
# Usage: ./validate-migration.sh

echo "=== Migration Validation Script ==="

errors=0
warnings=0

# Validate flattened libraries
echo "Validating flattened library structure..."

LIBRARIES_DIR="content/libraries"
if [[ -d "$LIBRARIES_DIR" ]]; then
    library_files=$(find "$LIBRARIES_DIR" -name "*.md" -type f | wc -l)
    library_dirs=$(find "$LIBRARIES_DIR" -type d -mindepth 1 | wc -l)
    
    echo "Found $library_files library files"
    echo "Found $library_dirs library directories (should be 0 after cleanup)"
    
    if [[ $library_files -eq 519 ]]; then
        echo "✓ All 519 library files migrated successfully"
    else
        echo "✗ Expected 519 library files, found $library_files"
        ((errors++))
    fi
else
    echo "✗ Libraries directory not found: $LIBRARIES_DIR"
    ((errors++))
fi

# Validate logbook structure
echo ""
echo "Validating logbook structure..."

LOGBOOKS_DIR="content/logbooks"
if [[ -d "$LOGBOOKS_DIR" ]]; then
    logbook_dirs=$(find "$LOGBOOKS_DIR" -type d -mindepth 1 | wc -l)
    logbook_files=$(find "$LOGBOOKS_DIR" -name "*.md" -type f | wc -l)
    
    echo "Found $logbook_dirs logbook directories"
    echo "Found $logbook_files logbook entries"
    
    if [[ $logbook_dirs -eq 519 ]]; then
        echo "✓ All 519 logbook directories created"
    else
        echo "✗ Expected 519 logbook directories, found $logbook_dirs"
        ((errors++))
    fi
    
    if [[ $logbook_files -gt 500 ]]; then
        echo "✓ Logbook entries migrated ($logbook_files files)"
    else
        echo "⚠ Only $logbook_files logbook entries found"
        ((warnings++))
    fi
else
    echo "✗ Logbooks directory not found: $LOGBOOKS_DIR"
    ((errors++))
fi

# Test sample library file format
echo ""
echo "Validating library file format..."

sample_lib="$LIBRARIES_DIR/00001.md"
if [[ -f "$sample_lib" ]]; then
    if grep -q "library_id:" "$sample_lib"; then
        echo "✓ Sample library file has library_id field"
    else
        echo "✗ Sample library file missing library_id field"
        ((errors++))
    fi
    
    if grep -q "title:" "$sample_lib"; then
        echo "✓ Sample library file has title field"
    else
        echo "✗ Sample library file missing title field"
        ((errors++))
    fi
else
    echo "✗ Sample library file not found: $sample_lib"
    ((errors++))
fi

# Test sample logbook file format
echo ""
echo "Validating logbook file format..."

sample_logbook="$LOGBOOKS_DIR/00001/2024-08-08.md"
if [[ -f "$sample_logbook" ]]; then
    if grep -q "library_id:" "$sample_logbook"; then
        echo "✓ Sample logbook file has library_id field"
    else
        echo "✗ Sample logbook file missing library_id field"
        ((errors++))
    fi
    
    if grep -q "date:" "$sample_logbook"; then
        echo "✓ Sample logbook file has date field"
    else
        echo "✗ Sample logbook file missing date field"
        ((errors++))
    fi
else
    echo "✗ Sample logbook file not found: $sample_logbook"
    ((errors++))
fi

# Check for orphaned directories
echo ""
echo "Checking for orphaned content..."

orphaned_dirs=$(find "$LIBRARIES_DIR" -type d -mindepth 1 | wc -l)
if [[ $orphaned_dirs -gt 0 ]]; then
    echo "⚠ Found $orphaned_dirs orphaned library directories (should be cleaned up)"
    echo "  These directories can be safely removed after backup verification:"
    find "$LIBRARIES_DIR" -type d -mindepth 1 | head -5
    if [[ $orphaned_dirs -gt 5 ]]; then
        echo "  ... and $((orphaned_dirs - 5)) more"
    fi
    ((warnings++))
else
    echo "✓ No orphaned library directories found"
fi

# Summary
echo ""
echo "=== Validation Summary ==="
echo "Errors: $errors"
echo "Warnings: $warnings"

if [[ $errors -eq 0 && $warnings -eq 0 ]]; then
    echo "✓ Migration validation passed successfully!"
    echo "  - All 519 libraries migrated to flattened structure"
    echo "  - All logbook entries reorganized by library ID"
    echo "  - File formats validated"
    echo "  - Ready for cleanup phase"
    exit 0
elif [[ $errors -eq 0 ]]; then
    echo "⚠ Migration validation completed with warnings"
    echo "  Review warnings before proceeding to cleanup"
    exit 0
else
    echo "✗ Migration validation failed with errors"
    echo "  Fix errors before proceeding"
    exit 1
fi