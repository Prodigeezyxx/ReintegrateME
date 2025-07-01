
import { JobPosting } from '../../models/types';
import { supabase } from '@/integrations/supabase/client';

export const getHirerJobs = async (): Promise<JobPosting[]> => {
  // Get current user from Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Authentication required to access job postings');
  }
  
  const { data: jobs, error } = await supabase
    .from('job_postings')
    .select(`
      *,
      company_profiles!inner(
        company_name,
        logo_url
      )
    `)
    .eq('hirer_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }
  
  // Transform the data to match the JobPosting interface
  return jobs.map(job => ({
    id: job.id,
    hirerId: job.hirer_id,
    companyId: job.company_id,
    title: job.title,
    description: job.description,
    companyName: job.company_profiles.company_name,
    companyLogoUrl: job.company_profiles.logo_url,
    category: job.category,
    employmentType: job.employment_type,
    experienceLevel: job.experience_level,
    locationCity: job.location_city,
    locationCountry: job.location_country,
    requiredSkills: job.required_skills,
    salary: {
      min: job.salary_min,
      max: job.salary_max,
      currency: job.salary_currency,
    },
    subjectToDbsBarring: job.subject_to_dbs_barring,
    createdAt: new Date(job.created_at),
    status: job.status as 'active' | 'draft' | 'archived',
  }));
};
