ALTER TABLE file_blobs 
ADD COLUMN located_on VARCHAR(50) DEFAULT 'LOCAL' NOT NULL;

CREATE INDEX idx_file_blobs_pending_sync 
ON file_blobs(located_on) 
WHERE located_on = 'LOCAL';