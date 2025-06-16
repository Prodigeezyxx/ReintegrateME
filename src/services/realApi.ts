
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, SeekerProfile, CompanyProfile, JobPosting, SwipeableCardData, MatchRecord } from '../models/types';

// Sample data for demo purposes
export const jobCategories = [
  'Construction', 
  'Manufacturing',
  'Transportation',
  'Retail',
  'Hospitality',
  'Healthcare',
  'Service Industry',
  'Maintenance',
  'Logistics',
  'Agriculture'
];

export const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Apprenticeship'
];

export const skills = [
  'Carpentry',
  'Plumbing',
  'Electrical',
  'Forklift Operation',
  'Welding',
  'HVAC',
  'HGV Driving',
  'Food Service',
  'Customer Service',
  'Equipment Maintenance',
  'Machinery Operation',
  'Health & Safety Compliance'
];

export const countries = [
  'United Kingdom',
  'Ireland',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Sweden',
  'Denmark'
];

// Company Profile API
export const companyAPI = {
  createProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('company_profiles')
      .insert({
        user_id: user.id,
        company_name: profileData.companyName || '',
        industry: profileData.industry,
        company_size: profileData.companySize,
        website_url: profileData.websiteUrl,
        description: profileData.description,
        location_city: profileData.locationCity,
        location_country: profileData.locationCountry,
        profile_completion_percentage: 30
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      companyName: data.company_name,
      logoUrl: data.logo_url,
      industry: data.industry,
      companySize: data.company_size,
      websiteUrl: data.website_url,
      description: data.description,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      profileCompletionPercentage: data.profile_completion_percentage
    };
  },

  getProfile: async (): Promise<CompanyProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      companyName: data.company_name,
      logoUrl: data.logo_url,
      industry: data.industry,
      companySize: data.company_size,
      websiteUrl: data.website_url,
      description: data.description,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      profileCompletionPercentage: data.profile_completion_percentage
    };
  },

  updateProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const updateData: any = {};
    if (profileData.companyName !== undefined) updateData.company_name = profileData.companyName;
    if (profileData.logoUrl !== undefined) updateData.logo_url = profileData.logoUrl;
    if (profileData.industry !== undefined) updateData.industry = profileData.industry;
    if (profileData.companySize !== undefined) updateData.company_size = profileData.companySize;
    if (profileData.websiteUrl !== undefined) updateData.website_url = profileData.websiteUrl;
    if (profileData.description !== undefined) updateData.description = profileData.description;
    if (profileData.locationCity !== undefined) updateData.location_city = profileData.locationCity;
    if (profileData.locationCountry !== undefined) updateData.location_country = profileData.locationCountry;

    const { data, error } = await supabase
      .from('company_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      companyName: data.company_name,
      logoUrl: data.logo_url,
      industry: data.industry,
      companySize: data.company_size,
      websiteUrl: data.website_url,
      description: data.description,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      profileCompletionPercentage: data.profile_completion_percentage
    };
  }
};

// Seeker Profile API
export const seekerAPI = {
  createProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('seeker_profiles')
      .insert({
        user_id: user.id,
        headline: profileData.headline,
        bio: profileData.bio,
        key_skills: profileData.keySkills,
        location_city: profileData.locationCity,
        location_country: profileData.locationCountry,
        preferred_job_categories: profileData.preferredJobCategories,
        preferred_employment_types: profileData.preferredEmploymentTypes,
        availability_status: 'actively_looking',
        profile_completion_percentage: 30
      })
      .select()
      .single();

    if (error) throw error;

    // Also update the main profile with names
    if (profileData.firstName || profileData.lastName) {
      await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          display_name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
        })
        .eq('id', user.id);
    }

    return {
      id: data.id,
      userId: data.user_id,
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      displayName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
      headline: data.headline,
      bio: data.bio,
      keySkills: data.key_skills,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      preferredJobCategories: data.preferred_job_categories,
      preferredEmploymentTypes: data.preferred_employment_types,
      availabilityStatus: data.availability_status,
      profileCompletionPercentage: data.profile_completion_percentage
    };
  },

  getProfile: async (): Promise<SeekerProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: seekerData, error: seekerError } = await supabase
      .from('seeker_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (seekerError) throw seekerError;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, last_name, display_name')
      .eq('id', user.id)
      .single();

    return {
      id: seekerData.id,
      userId: seekerData.user_id,
      firstName: profileData?.first_name || '',
      lastName: profileData?.last_name || '',
      displayName: profileData?.display_name || '',
      headline: seekerData.headline,
      bio: seekerData.bio,
      keySkills: seekerData.key_skills,
      locationCity: seekerData.location_city,
      locationCountry: seekerData.location_country,
      preferredJobCategories: seekerData.preferred_job_categories,
      preferredEmploymentTypes: seekerData.preferred_employment_types,
      availabilityStatus: seekerData.availability_status,
      profileCompletionPercentage: seekerData.profile_completion_percentage
    };
  },

  updateProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const updateData: any = {};
    if (profileData.headline !== undefined) updateData.headline = profileData.headline;
    if (profileData.bio !== undefined) updateData.bio = profileData.bio;
    if (profileData.keySkills !== undefined) updateData.key_skills = profileData.keySkills;
    if (profileData.locationCity !== undefined) updateData.location_city = profileData.locationCity;
    if (profileData.locationCountry !== undefined) updateData.location_country = profileData.locationCountry;
    if (profileData.preferredJobCategories !== undefined) updateData.preferred_job_categories = profileData.preferredJobCategories;
    if (profileData.preferredEmploymentTypes !== undefined) updateData.preferred_employment_types = profileData.preferredEmploymentTypes;
    if (profileData.availabilityStatus !== undefined) updateData.availability_status = profileData.availabilityStatus;

    const { data, error } = await supabase
      .from('seeker_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    // Update names in main profile if provided
    if (profileData.firstName !== undefined || profileData.lastName !== undefined) {
      const profileUpdateData: any = {};
      if (profileData.firstName !== undefined) profileUpdateData.first_name = profileData.firstName;
      if (profileData.lastName !== undefined) profileUpdateData.last_name = profileData.lastName;
      if (profileData.firstName !== undefined || profileData.lastName !== undefined) {
        profileUpdateData.display_name = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
      }

      await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', user.id);
    }

    const { data: profileData: updatedProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name, display_name')
      .eq('id', user.id)
      .single();

    return {
      id: data.id,
      userId: data.user_id,
      firstName: updatedProfile?.first_name || '',
      lastName: updatedProfile?.last_name || '',
      displayName: updatedProfile?.display_name || '',
      headline: data.headline,
      bio: data.bio,
      keySkills: data.key_skills,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      preferredJobCategories: data.preferred_job_categories,
      preferredEmploymentTypes: data.preferred_employment_types,
      availabilityStatus: data.availability_status,
      profileCompletionPercentage: data.profile_completion_percentage
    };
  }
};

// Job API
export const jobAPI = {
  createJob: async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get company profile
    const { data: companyProfile, error: companyError } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (companyError) throw new Error('Company profile not found');

    const { data, error } = await supabase
      .from('job_postings')
      .insert({
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
        status: jobData.status || 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      hirerId: data.hirer_id,
      companyId: data.company_id,
      title: data.title,
      description: data.description,
      companyName: companyProfile.company_name,
      companyLogoUrl: companyProfile.logo_url,
      category: data.category,
      employmentType: data.employment_type,
      experienceLevel: data.experience_level,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      requiredSkills: data.required_skills,
      salary: {
        min: data.salary_min,
        max: data.salary_max,
        currency: data.salary_currency
      },
      status: data.status,
      createdAt: new Date(data.created_at)
    };
  },

  getHirerJobs: async (): Promise<JobPosting[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company_profiles!inner(company_name, logo_url)
      `)
      .eq('hirer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(job => ({
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
        currency: job.salary_currency
      },
      status: job.status,
      createdAt: new Date(job.created_at)
    }));
  },

  getJobsFeed: async (): Promise<SwipeableCardData[]> => {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company_profiles!inner(company_name, logo_url)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return data.map(job => ({
      id: job.id,
      type: 'job' as const,
      primaryImageUrl: job.company_profiles.logo_url,
      titleText: job.title,
      subtitleText: job.company_profiles.company_name,
      detailLine1: job.location_city && job.location_country ? `${job.location_city}, ${job.location_country}` : undefined,
      detailLine2: job.employment_type,
      tags: job.required_skills || []
    }));
  }
};
