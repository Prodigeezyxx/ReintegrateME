
-- Add subject_to_dbs_barring column to job_postings table
ALTER TABLE public.job_postings 
ADD COLUMN subject_to_dbs_barring boolean DEFAULT false;
