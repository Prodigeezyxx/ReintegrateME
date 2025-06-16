
import { supabase } from '@/integrations/supabase/client';
import { CompanyProfile, JobPosting } from '../models/types';

export const realCompanyAPI = {
  createInitialProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('company_profiles')
      .insert([{
        user_id: user.id,
        company_name: profileData.companyName || '',
        industry: profileData.industry,
        company_size: profileData.companySize,
        website_url: profileData.websiteUrl,
        description: profileData.description,
        location_city: profileData.locationCity,
        location_country: profileData.locationCountry,
        profile_completion_percentage: 30
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create company profile: ${error.message}`);
    }

    // Transform database response to match TypeScript interface
    const companyProfile: CompanyProfile = {
      id: data.id,
      userId: data.user_id,
      companyName: data.company_name,
      industry: data.industry,
      companySize: data.company_size,
      websiteUrl: data.website_url,
      description: data.description,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      logoUrl: data.logo_url,
      profileCompletionPercentage: data.profile_completion_percentage
    };

    return companyProfile;
  },

  getProfile: async (): Promise<CompanyProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw new Error(`Failed to get company profile: ${error.message}`);
    }

    // Transform database response to match TypeScript interface
    const companyProfile: CompanyProfile = {
      id: data.id,
      userId: data.user_id,
      companyName: data.company_name,
      industry: data.industry,
      companySize: data.company_size,
      websiteUrl: data.website_url,
      description: data.description,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      logoUrl: data.logo_url,
      profileCompletionPercentage: data.profile_completion_percentage
    };

    return companyProfile;
  }
};

export const realJobAPI = {
  createJob: async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get company profile first
    const companyProfile = await realCompanyAPI.getProfile();

    const { data, error } = await supabase
      .from('job_postings')
      .insert([{
        hirer_id: user.id,
        company_id: companyProfile.id,
        title: jobData.title || '',
        description: jobData.description || '',
        category: jobData.category || '',
        employment_type: jobData.employmentType || '',
        experience_level: jobData.experienceLevel,
        location_city: jobData.locationCity,
        location_country: jobData.locationCountry,
        required_skills: jobData.requiredSkills,
        salary_min: jobData.salary?.min,
        salary_max: jobData.salary?.max,
        salary_currency: jobData.salary?.currency || 'GBP',
        salary_period: jobData.salary?.period || 'annual',
        status: jobData.status || 'active'
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create job posting: ${error.message}`);
    }

    // Transform database response to match TypeScript interface
    const jobPosting: JobPosting = {
      id: data.id,
      hirerId: data.hirer_id,
      companyId: data.company_id,
      title: data.title,
      description: data.description,
      companyName: companyProfile.companyName,
      companyLogoUrl: companyProfile.logoUrl,
      category: data.category,
      employmentType: data.employment_type,
      experienceLevel: data.experience_level,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      requiredSkills: data.required_skills,
      salary: data.salary_min && data.salary_max ? {
        min: data.salary_min,
        max: data.salary_max,
        currency: data.salary_currency,
        period: data.salary_period
      } : undefined,
      createdAt: new Date(data.created_at),
      status: data.status as 'active' | 'draft' | 'archived'
    };

    return jobPosting;
  },

  getHirerJobs: async (): Promise<JobPosting[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company_profiles!inner(company_name, logo_url)
      `)
      .eq('hirer_id', user.id);

    if (error) {
      throw new Error(`Failed to get job postings: ${error.message}`);
    }

    // Transform database response to match TypeScript interface
    const jobPostings: JobPosting[] = data.map(job => ({
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
      salary: job.salary_min && job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: job.salary_currency,
        period: job.salary_period
      } : undefined,
      createdAt: new Date(job.created_at),
      status: job.status as 'active' | 'draft' | 'archived'
    }));

    return jobPostings;
  }
};
