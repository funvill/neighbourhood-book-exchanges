#!/bin/bash
# Migration Script: Flatten Library Structure (Bash version for testing)
# Migrates from content/libraries/*/index.md to content/libraries/*.md
# Usage: ./migrate-libraries.sh [--dry-run]

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
fi

echo "=== Library Migration Script ==="
echo "Dry Run Mode: $DRY_RUN"

LIBRARIES_DIR="content/libraries"
BACKUP_DIR="backup/libraries-$(date +%Y-%m-%d-%H%M%S)"

if [[ ! -d "$LIBRARIES_DIR" ]]; then
    echo "Error: Libraries directory not found: $LIBRARIES_DIR" >&2
    exit 1
fi

# Create backup directory
if [[ "$DRY_RUN" == "false" ]] && [[ ! -d "$BACKUP_DIR" ]]; then
    mkdir -p "$BACKUP_DIR"
    echo "Created backup directory: $BACKUP_DIR"
fi

processed=0
errors=0

for folder in "$LIBRARIES_DIR"/*/; do
    if [[ ! -d "$folder" ]]; then
        continue
    fi
    
    folder_name=$(basename "$folder")
    index_path="$folder/index.md"
    
    if [[ ! -f "$index_path" ]]; then
        echo "Warning: Skipping $folder_name: No index.md found"
        continue
    fi
    
    # Extract library_id from frontmatter (handle both quoted and unquoted values)
    library_id=$(grep -m1 "^library_id:" "$index_path" | sed "s/library_id:[ ]*['\"]\\?\([0-9]*\\)['\"]\\?.*/\\1/")
    
    if [[ -z "$library_id" ]]; then
        echo "Warning: No library_id found in $folder_name, skipping"
        continue
    fi
    
    # Create new filename: library_id.md
    new_filename="$library_id.md"
    new_path="$LIBRARIES_DIR/$new_filename"
    
    echo "Processing: $folder_name -> $new_filename"
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Backup original folder
        cp -r "$folder" "$BACKUP_DIR/"
        
        # Write flattened file
        cp "$index_path" "$new_path"
        
        echo "  Created: $new_path"
    else
        echo "  [DRY RUN] Would create: $new_path"
    fi
    
    ((processed++))
done

echo "=== Migration Summary ==="
echo "Processed: $processed libraries"
echo "Errors: $errors"

if [[ "$DRY_RUN" == "false" ]]; then
    echo "Backup created at: $BACKUP_DIR"
    echo "Next step: Run migrate-logbooks.sh"
else
    echo "Run without --dry-run to execute migration"
fi