
-- Create enum types for legal and employment information
CREATE TYPE conviction_type AS ENUM (
  'theft_burglary_robbery',
  'fraud_financial',
  'drug_possession',
  'drug_supply_production',
  'driving_offences',
  'assault_violent',
  'sexual_offences',
  'public_order',
  'domestic_abuse',
  'terrorism_related',
  'weapons_offences',
  'harassment_stalking',
  'arson',
  'breach_court_orders',
  'other'
);

CREATE TYPE legal_supervision_type AS ENUM (
  'probation',
  'parole',
  'community_sentence',
  'licence',
  'mappa_oversight',
  'none'
);

CREATE TYPE conviction_status AS ENUM (
  'spent',
  'unspent',
  'pending'
);

CREATE TYPE mappa_level AS ENUM (
  'level_1',
  'level_2',
  'level_3',
  'not_applicable'
);

CREATE TYPE disability_type AS ENUM (
  'mobility_physical',
  'sensory_hearing_vision',
  'long_term_medical',
  'neurodivergence',
  'learning_difficulty',
  'mental_health',
  'communication_needs',
  'cognitive_memory',
  'other',
  'prefer_not_to_specify'
);

CREATE TYPE workplace_adjustment AS ENUM (
  'flexible_hours',
  'remote_work',
  'training_support',
  'assistive_technology',
  'modified_environment',
  'communication_support',
  'none',
  'other'
);

CREATE TYPE work_preference AS ENUM (
  'full_time',
  'part_time',
  'zero_hours',
  'weekends',
  'nights'
);

-- Expand the seeker_profiles table with comprehensive ReintegrateMe fields
ALTER TABLE seeker_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,

-- Legal Information
ADD COLUMN IF NOT EXISTS sentence_completed BOOLEAN,
ADD COLUMN IF NOT EXISTS current_legal_supervision legal_supervision_type,
ADD COLUMN IF NOT EXISTS conviction_types conviction_type[],
ADD COLUMN IF NOT EXISTS conviction_status conviction_status,
ADD COLUMN IF NOT EXISTS conviction_other_details TEXT,
ADD COLUMN IF NOT EXISTS barred_from_regulated_work BOOLEAN,
ADD COLUMN IF NOT EXISTS on_dbs_barring_list BOOLEAN,
ADD COLUMN IF NOT EXISTS mappa_level mappa_level,
ADD COLUMN IF NOT EXISTS relevant_for_safeguarding_checks BOOLEAN,

-- Disability & Health Information
ADD COLUMN IF NOT EXISTS has_disability BOOLEAN,
ADD COLUMN IF NOT EXISTS disability_types disability_type[],
ADD COLUMN IF NOT EXISTS disability_other_details TEXT,
ADD COLUMN IF NOT EXISTS workplace_adjustments workplace_adjustment[],
ADD COLUMN IF NOT EXISTS workplace_adjustments_other TEXT,

-- Employment Preferences
ADD COLUMN IF NOT EXISTS has_driving_licence BOOLEAN,
ADD COLUMN IF NOT EXISTS work_preferences work_preference[],
ADD COLUMN IF NOT EXISTS open_to_relocation BOOLEAN;

-- Create RLS policies for seeker_profiles
ALTER TABLE seeker_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profiles
CREATE POLICY "Users can view their own seeker profile" 
  ON seeker_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own seeker profile" 
  ON seeker_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own seeker profile" 
  ON seeker_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_seeker_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only create seeker profile if user role is seeker
  IF NEW.role = 'seeker' THEN
    INSERT INTO public.seeker_profiles (
      user_id,
      first_name,
      last_name,
      email,
      profile_completion_percentage
    )
    VALUES (
      NEW.id,
      NEW.first_name,
      NEW.last_name,
      NEW.email,
      10 -- Starting completion percentage
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create seeker profile when user profile is updated with seeker role
CREATE OR REPLACE TRIGGER on_seeker_profile_creation
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (NEW.role = 'seeker' AND OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION public.handle_new_seeker_profile();
