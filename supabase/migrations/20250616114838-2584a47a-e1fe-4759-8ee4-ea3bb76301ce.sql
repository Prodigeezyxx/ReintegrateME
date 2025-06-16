
-- Create seeker profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.seeker_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  headline TEXT,
  bio TEXT,
  key_skills TEXT[],
  location_city TEXT,
  location_country TEXT,
  preferred_job_categories TEXT[],
  preferred_employment_types TEXT[],
  availability_status TEXT DEFAULT 'actively_looking' CHECK (availability_status IN ('actively_looking', 'open_to_opportunities', 'not_looking')),
  profile_completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  company_size TEXT,
  website_url TEXT,
  description TEXT,
  location_city TEXT,
  location_country TEXT,
  profile_completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job postings table (if not exists)
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hirer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.company_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  experience_level TEXT,
  location_city TEXT,
  location_country TEXT,
  required_skills TEXT[],
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'GBP',
  salary_period TEXT DEFAULT 'annual',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swipe records table (if not exists)
CREATE TABLE IF NOT EXISTS public.swipe_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  swiped_entity_id UUID NOT NULL,
  swiped_entity_type TEXT NOT NULL CHECK (swiped_entity_type IN ('seeker', 'job')),
  swipe_type TEXT NOT NULL CHECK (swipe_type IN ('like', 'pass', 'super_like')),
  context_job_id UUID,
  hirer_company_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table (if not exists)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hirer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  context_job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  chat_thread_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipe_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seeker_profiles
CREATE POLICY "Seeker can view own profile" ON public.seeker_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Hirers can view seeker profiles" ON public.seeker_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'hirer'
    )
  );

-- RLS Policies for company_profiles
CREATE POLICY "Hirer can view own company profile" ON public.company_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Seekers can view company profiles" ON public.company_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'seeker'
    )
  );

-- RLS Policies for job_postings
CREATE POLICY "Hirer can manage own jobs" ON public.job_postings
  FOR ALL USING (auth.uid() = hirer_id);

CREATE POLICY "Seekers can view active jobs" ON public.job_postings
  FOR SELECT USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'seeker'
    )
  );

-- RLS Policies for swipe_records
CREATE POLICY "Users can manage own swipes" ON public.swipe_records
  FOR ALL USING (auth.uid() = swiper_id);

-- RLS Policies for matches
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT USING (auth.uid() = hirer_id OR auth.uid() = seeker_id);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers for new tables
DROP TRIGGER IF EXISTS handle_updated_at ON public.seeker_profiles;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.seeker_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.company_profiles;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.job_postings;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
