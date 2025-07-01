
import { JobPosting } from '../../models/types';
import { supabase } from '@/integrations/supabase/client';

export const createJob = async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
  // Get current user from Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Authentication required to create job postings');
  }
  
  // Get company profile for the user
  const { data: companyProfile, error: companyError } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (companyError || !companyProfile) {
    throw new Error('Company profile not found. Please complete your company profile first.');
  }
  
  // Create the job posting
  const newJobData = {
    hirer_id: user.id,
    company_id: companyProfile.id,
    title: jobData.title || '',
    description: jobData.description || '',
    category: jobData.category || '',
    employment_type: jobData.employmentType || '',
    experience_level: jobData.experienceLevel,
    location_city: jobData.locationCity,
    location_country: jobData.locationCountry,
    required_skills: jobData.requiredSkills || [],
    salary_min: jobData.salary?.min,
    salary_max: jobData.salary?.max,
    salary_currency: jobData.salary?.currency || 'GBP',
    subject_to_dbs_barring: jobData.subjectToDbsBarring || false,
    status: jobData.status || 'active',
  };
  
  const { data: newJob, error: insertError } = await supabase
    .from('job_postings')
    .insert([newJobData])
    .select(`
      *,
      company_profiles!inner(
        company_name,
        logo_url
      )
    `)
    .single();
  
  if (insertError) {
    throw new Error(`Failed to create job posting: ${insertError.message}`);
  }
  
  // Transform the data to match the JobPosting interface
  const jobPosting: JobPosting = {
    id: newJob.id,
    hirerId: newJob.hirer_id,
    companyId: newJob.company_id,
    title: newJob.title,
    description: newJob.description,
    companyName: newJob.company_profiles.company_name,
    companyLogoUrl: newJob.company_profiles.logo_url,
    category: newJob.category,
    employmentType: newJob.employment_type,
    experienceLevel: newJob.experience_level,
    locationCity: newJob.location_city,
    locationCountry: newJob.location_country,
    requiredSkills: newJob.required_skills,
    salary: {
      min: newJob.salary_min,
      max: newJob.salary_max,
      currency: newJob.salary_currency,
    },
    subjectToDbsBarring: newJob.subject_to_dbs_barring,
    createdAt: new Date(newJob.created_at),
    status: newJob.status as 'active' | 'draft' | 'archived',
  };
  
  return jobPosting;
};
