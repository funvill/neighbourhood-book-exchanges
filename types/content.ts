/**
 * TypeScript interfaces and schemas for the new flattened content structure
 * Defines standardized frontmatter schema for libraries and logbooks
 */

/**
 * Geographic coordinate interface
 */
export interface Coordinates {
    /** Latitude in decimal degrees */
    lat: number;
    /** Longitude in decimal degrees */
    lng: number;
    /** Human-readable address (optional) */
    address?: string;
}

/**
 * Library frontmatter schema for content/libraries/*.md files
 * Represents a single Little Free Library location
 */
export interface LibraryFrontmatter {
    /** Unique 5-digit zero-padded library identifier (e.g., "00001") */
    library_id: string;
    
    /** Display title of the library */
    title: string;
    
    /** Geographic location */
    location: Coordinates;
    
    /** Primary photo path (absolute path to public/images/libraries/{library_id}/) */
    photo?: string;
    
    /** Array of category tags */
    tags?: string[];
    
    /** Additional photo paths for gallery */
    images?: string[];
    
    /** Optional description or notes */
    description?: string;
    
    /** Library status */
    status?: 'active' | 'inactive' | 'uncertain' | 'removed';
    
    /** External website URL */
    website?: string;
    
    /** Contact email */
    email?: string;
    
    /** Installation date */
    installed?: string;
    
    /** Last verification date */
    verified?: string;
}

/**
 * Logbook entry frontmatter schema for content/logbooks/{library_id}/*.md files
 * Represents a visit or update to a library
 */
export interface LogbookEntryFrontmatter {
    /** Reference to parent library */
    library_id: string;
    
    /** Entry date in YYYY-MM-DD format */
    date: string;
    
    /** Optional title for the entry */
    title?: string;
    
    /** Entry type */
    type?: 'visit' | 'maintenance' | 'report' | 'photo' | 'import';
    
    /** Tags for categorization */
    tags?: string[];
    
    /** Photos taken during this visit */
    photos?: string[];
    
    /** Condition of library */
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
    
    /** Books added/removed counts */
    books?: {
        added?: number;
        removed?: number;
        total?: number;
    };
    
    /** Weather conditions */
    weather?: string;
    
    /** Visitor name/initials */
    visitor?: string;
    
    /** Import metadata for migrated entries */
    import?: {
        source: string;
        original_id?: string;
        imported_at: string;
    };
}

/**
 * Library summary interface for API responses and components
 * Flattened representation for list views
 */
export interface LibrarySummary {
    /** Unique library identifier */
    library_id: string;
    
    /** URL-friendly slug derived from title */
    slug: string;
    
    /** Display title */
    title: string;
    
    /** Geographic location */
    location: Coordinates;
    
    /** Primary photo URL */
    photo: string;
    
    /** Category tags */
    tags: string[];
    
    /** Brief description */
    description: string;
    
    /** Content path for Nuxt Content */
    _path: string;
    
    /** Library status */
    status?: string;
    
    /** Number of logbook entries */
    logbook_count?: number;
    
    /** Last update timestamp */
    last_updated?: string;
}

/**
 * Logbook entry summary for API responses
 */
export interface LogbookEntrySummary {
    /** Parent library ID */
    library_id: string;
    
    /** Entry date */
    date: string;
    
    /** Entry title */
    title?: string;
    
    /** Entry type */
    type?: string;
    
    /** Content path */
    _path: string;
    
    /** Brief preview of content */
    preview?: string;
    
    /** Associated photos */
    photos?: string[];
}

/**
 * Migration result interface for validation
 */
export interface MigrationResult {
    /** Migration success status */
    success: boolean;
    
    /** Number of libraries processed */
    libraries_migrated: number;
    
    /** Number of logbook entries migrated */
    logbook_entries_migrated: number;
    
    /** Number of images migrated */
    images_migrated: number;
    
    /** List of errors encountered */
    errors: string[];
    
    /** List of warnings */
    warnings: string[];
    
    /** Backup directory path */
    backup_path?: string;
}

/**
 * Path mapping for image migration
 */
export interface ImagePathMapping {
    /** Original path in content directory */
    original: string;
    
    /** New path in public directory */
    target: string;
    
    /** Normalized filename */
    filename: string;
    
    /** Parent library ID */
    library_id: string;
}

/**
 * Validation result for content integrity checks
 */
export interface ValidationResult {
    /** Validation success status */
    valid: boolean;
    
    /** Number of files validated */
    files_checked: number;
    
    /** Number of validation errors */
    errors: number;
    
    /** Number of warnings */
    warnings: number;
    
    /** Detailed issues found */
    issues: ValidationIssue[];
}

/**
 * Individual validation issue
 */
export interface ValidationIssue {
    /** Issue severity */
    severity: 'error' | 'warning' | 'info';
    
    /** File path where issue was found */
    file: string;
    
    /** Description of the issue */
    message: string;
    
    /** Field name if related to frontmatter */
    field?: string;
}

/**
 * Type guards for runtime validation
 */
export function isLibraryFrontmatter(obj: any): obj is LibraryFrontmatter {
    return (
        typeof obj === 'object' &&
        typeof obj.library_id === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.location === 'object' &&
        typeof obj.location.lat === 'number' &&
        typeof obj.location.lng === 'number'
    );
}

export function isLogbookEntryFrontmatter(obj: any): obj is LogbookEntryFrontmatter {
    return (
        typeof obj === 'object' &&
        typeof obj.library_id === 'string' &&
        typeof obj.date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(obj.date)
    );
}

/**
 * Constants for naming conventions
 */
export const NAMING_CONVENTIONS = {
    /** Library file naming pattern */
    LIBRARY_FILE_PATTERN: /^(\d{5})\.md$/,
    
    /** Logbook entry file naming pattern */
    LOGBOOK_FILE_PATTERN: /^\d{4}-\d{2}-\d{2}.*\.md$/,
    
    /** Image file naming pattern */
    IMAGE_FILE_PATTERN: /^[a-z0-9\-_.]+\.(jpg|jpeg|png|webp|avif|gif)$/i,
    
    /** Library ID format (5-digit zero-padded) */
    LIBRARY_ID_FORMAT: /^\d{5}$/,
    
    /** Date format for logbook entries */
    DATE_FORMAT: /^\d{4}-\d{2}-\d{2}$/
} as const;

/**
 * Default paths for the new structure
 */
export const CONTENT_PATHS = {
    /** Flattened libraries directory */
    LIBRARIES: 'content/libraries',
    
    /** Reorganized logbooks directory */
    LOGBOOKS: 'content/logbooks',
    
    /** Public images directory */
    IMAGES: 'public/images/libraries',
    
    /** Backup directory base */
    BACKUP: 'backup'
} as const;