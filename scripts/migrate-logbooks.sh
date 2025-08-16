#!/bin/bash
# Migration Script: Reorganize Logbook Entries (Bash version)
# Migrates from content/libraries/*/logbook/ to content/logbooks/*/
# Usage: ./migrate-logbooks.sh [--dry-run]

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
fi

echo "=== Logbook Migration Script ==="
echo "Dry Run Mode: $DRY_RUN"

LIBRARIES_DIR="content/libraries"
LOGBOOKS_DIR="content/logbooks"
BACKUP_DIR="backup/logbooks-$(date +%Y-%m-%d-%H%M%S)"

if [[ ! -d "$LIBRARIES_DIR" ]]; then
    echo "Error: Libraries directory not found: $LIBRARIES_DIR" >&2
    exit 1
fi

# Create logbooks and backup directories
if [[ "$DRY_RUN" == "false" ]]; then
    if [[ ! -d "$LOGBOOKS_DIR" ]]; then
        mkdir -p "$LOGBOOKS_DIR"
        echo "Created logbooks directory: $LOGBOOKS_DIR"
    fi
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        mkdir -p "$BACKUP_DIR"
        echo "Created backup directory: $BACKUP_DIR"
    fi
fi

processed=0
errors=0
total_entries=0

for folder in "$LIBRARIES_DIR"/*/; do
    if [[ ! -d "$folder" ]]; then
        continue
    fi
    
    folder_name=$(basename "$folder")
    index_path="$folder/index.md"
    logbook_path="$folder/logbook"
    
    if [[ ! -f "$index_path" ]]; then
        echo "Warning: Skipping $folder_name: No index.md found"
        continue
    fi
    
    if [[ ! -d "$logbook_path" ]]; then
        echo "No logbook for $folder_name"
        continue
    fi
    
    # Extract library_id from frontmatter (handle both quoted and unquoted values)
    library_id=$(grep -m1 "^library_id:" "$index_path" | sed "s/library_id:[ ]*['\"]\\?\([0-9]*\\)['\"]\\?.*/\\1/")
    
    if [[ -z "$library_id" ]]; then
        echo "Warning: No library_id found in $folder_name, skipping"
        continue
    fi
    
    # Create target directory for this library's logbook
    target_logbook_dir="$LOGBOOKS_DIR/$library_id"
    
    echo "Processing logbook: $folder_name -> logbooks/$library_id"
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Backup original logbook
        cp -r "$logbook_path" "$BACKUP_DIR/$folder_name-logbook"
        
        # Create target directory
        if [[ ! -d "$target_logbook_dir" ]]; then
            mkdir -p "$target_logbook_dir"
        fi
    fi
    
    # Process logbook entries
    entry_count=0
    for entry in "$logbook_path"/*.md; do
        if [[ ! -f "$entry" ]]; then
            continue
        fi
        
        entry_name=$(basename "$entry")
        target_entry_path="$target_logbook_dir/$entry_name"
        
        # Read and update logbook entry
        if [[ "$DRY_RUN" == "false" ]]; then
            # Add library_id to frontmatter if not present
            if ! grep -q "^library_id:" "$entry"; then
                # Insert library_id after the opening ---
                sed "1s/^---$/---\nlibrary_id: $library_id/" "$entry" > "$target_entry_path"
            else
                cp "$entry" "$target_entry_path"
            fi
            echo "  Migrated: $entry_name"
        else
            echo "  [DRY RUN] Would migrate: $entry_name"
        fi
        
        ((entry_count++))
        ((total_entries++))
    done
    
    if [[ $entry_count -gt 0 ]]; then
        ((processed++))
    fi
done

echo "=== Logbook Migration Summary ==="
echo "Processed: $processed library logbooks"
echo "Total entries: $total_entries"
echo "Errors: $errors"

if [[ "$DRY_RUN" == "false" ]]; then
    echo "Backup created at: $BACKUP_DIR"
    echo "Next step: Run migrate-images.sh"
else
    echo "Run without --dry-run to execute migration"
fi