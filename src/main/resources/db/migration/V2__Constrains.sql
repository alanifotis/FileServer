CREATE UNIQUE INDEX idx_meta_unique_nested 
ON file_metadata (user_id, parent_id, original_filename) 
WHERE parent_id IS NOT NULL AND is_folder = true AND is_trashed = false;

CREATE UNIQUE INDEX idx_meta_unique_root 
ON file_metadata (user_id, original_filename) 
WHERE parent_id IS NULL AND is_folder = true AND is_trashed = false;