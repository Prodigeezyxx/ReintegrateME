
import { CompanyProfile } from '../models/types';
import { supabase } from '@/integrations/supabase/client';

export const companyAPI = {
  getProfile: async (): Promise<CompanyProfile | null> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required');
    }
    
    const { data: profile, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No profile found
      }
      throw new Error(`Failed to fetch company profile: ${error.message}`);
    }
    
    return {
      id: profile.id,
      userId: profile.user_id,
      companyName: profile.company_name,
      logoUrl: profile.logo_url,
      industry: profile.industry,
      companySize: profile.company_size,
      websiteUrl: profile.website_url,
      description: profile.description,
      locationCity: profile.location_city,
      locationCountry: profile.location_country,
      profileCompletionPercentage: profile.profile_completion_percentage,
    };
  },

  updateProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required');
    }
    
    const updateData = {
      company_name: profileData.companyName,
      logo_url: profileData.logoUrl,
      industry: profileData.industry,
      company_size: profileData.companySize,
      website_url: profileData.websiteUrl,
      description: profileData.description,
      location_city: profileData.locationCity,
      location_country: profileData.locationCountry,
      profile_completion_percentage: profileData.profileCompletionPercentage,
    };
    
    const { data: profile, error } = await supabase
      .from('company_profiles')
      .upsert([{ user_id: user.id, ...updateData }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update company profile: ${error.message}`);
    }
    
    return {
      id: profile.id,
      userId: profile.user_id,
      companyName: profile.company_name,
      logoUrl: profile.logo_url,
      industry: profile.industry,
      companySize: profile.company_size,
      websiteUrl: profile.website_url,
      description: profile.description,
      locationCity: profile.location_city,
      locationCountry: profile.location_country,
      profileCompletionPercentage: profile.profile_completion_percentage,
    };
  },
};
