
-- Update the work_preference enum to include all the values used in the frontend
ALTER TYPE work_preference ADD VALUE IF NOT EXISTS 'contract';
ALTER TYPE work_preference ADD VALUE IF NOT EXISTS 'temporary';
ALTER TYPE work_preference ADD VALUE IF NOT EXISTS 'flexible_hours';
ALTER TYPE work_preference ADD VALUE IF NOT EXISTS 'remote_work';
ALTER TYPE work_preference ADD VALUE IF NOT EXISTS 'shift_work';
