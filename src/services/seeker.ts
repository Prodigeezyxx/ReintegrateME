
import { SeekerProfile } from '../models/types';
import { supabase } from '@/integrations/supabase/client';
import { 
  mapWorkplaceAdjustments, 
  mapDisabilityTypes, 
  mapConvictionTypes, 
  mapWorkPreferences,
  unmapWorkplaceAdjustments,
  unmapDisabilityTypes,
  unmapConvictionTypes,
  unmapWorkPreferences
} from '../utils/enumMappings';

export const seekerAPI = {
  createInitialProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.user_metadata?.role !== 'seeker') {
      throw new Error('Only job seekers can create a seeker profile');
    }
    
    const insertData = {
      user_id: user.id,
      first_name: profileData.firstName || '',
      last_name: profileData.lastName || '',
      job_title: profileData.jobTitle,
      headline: profileData.headline,
      bio: profileData.bio,
      key_skills: profileData.keySkills || [],
      location_city: profileData.locationCity,
      location_country: profileData.locationCountry,
      availability_status: 'actively_looking',
      profile_completion_percentage: profileData.keySkills && profileData.keySkills.length > 0 ? 40 : 30,
    };
    
    const { data: profile, error } = await supabase
      .from('seeker_profiles')
      .insert([insertData])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create seeker profile: ${error.message}`);
    }
    
    return {
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: `${profile.first_name} ${profile.last_name}`.trim(),
      jobTitle: profile.job_title,
      headline: profile.headline,
      bio: profile.bio,
      keySkills: profile.key_skills,
      locationCity: profile.location_city,
      locationCountry: profile.location_country,
      availabilityStatus: profile.availability_status as 'actively_looking' | 'open_to_opportunities' | 'not_looking',
      profileCompletionPercentage: profile.profile_completion_percentage,
    };
  },
  
  completeProfileSetup: async (allSetupData: any): Promise<SeekerProfile> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.user_metadata?.role !== 'seeker') {
      throw new Error('Only job seekers can complete profile setup');
    }
    
    const updateData = {
      user_id: user.id,
      first_name: allSetupData.firstName || '',
      last_name: allSetupData.lastName || '',
      job_title: allSetupData.jobTitle,
      headline: allSetupData.headline,
      sentence_completed: allSetupData.sentenceCompleted,
      current_legal_supervision: allSetupData.currentLegalSupervision,
      conviction_types: allSetupData.convictionTypes ? mapConvictionTypes(allSetupData.convictionTypes) : null,
      conviction_status: allSetupData.convictionStatus,
      conviction_other_details: allSetupData.convictionOtherDetails,
      barred_from_regulated_work: allSetupData.barredFromRegulatedWork,
      on_dbs_barring_list: allSetupData.onDbsBarringList,
      mappa_level: allSetupData.mappaLevel,
      relevant_for_safeguarding_checks: allSetupData.relevantForSafeguardingChecks,
      has_disability: allSetupData.hasDisability,
      disability_types: allSetupData.disabilityTypes ? mapDisabilityTypes(allSetupData.disabilityTypes) : null,
      disability_other_details: allSetupData.disabilityOtherDetails,
      workplace_adjustments: allSetupData.workplaceAdjustments ? mapWorkplaceAdjustments(allSetupData.workplaceAdjustments) : null,
      workplace_adjustments_other: allSetupData.workplaceAdjustmentsOther,
      has_driving_licence: allSetupData.hasDrivingLicence,
      work_preferences: allSetupData.workPreferences ? mapWorkPreferences(allSetupData.workPreferences) : null,
      open_to_relocation: allSetupData.openToRelocation,
      availability_status: 'actively_looking',
      profile_completion_percentage: 85
    };
    
    const { data: profile, error } = await supabase
      .from('seeker_profiles')
      .upsert(updateData)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to complete profile setup: ${error.message}`);
    }
    
    return {
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: `${profile.first_name} ${profile.last_name}`.trim(),
      jobTitle: profile.job_title,
      headline: profile.headline,
      sentenceCompleted: profile.sentence_completed,
      currentLegalSupervision: profile.current_legal_supervision,
      convictionTypes: profile.conviction_types ? unmapConvictionTypes(profile.conviction_types) : undefined,
      convictionStatus: profile.conviction_status,
      convictionOtherDetails: profile.conviction_other_details,
      barredFromRegulatedWork: profile.barred_from_regulated_work,
      onDbsBarringList: profile.on_dbs_barring_list,
      mappaLevel: profile.mappa_level,
      relevantForSafeguardingChecks: profile.relevant_for_safeguarding_checks,
      hasDisability: profile.has_disability,
      disabilityTypes: profile.disability_types ? unmapDisabilityTypes(profile.disability_types) : undefined,
      disabilityOtherDetails: profile.disability_other_details,
      workplaceAdjustments: profile.workplace_adjustments ? unmapWorkplaceAdjustments(profile.workplace_adjustments) : undefined,
      workplaceAdjustmentsOther: profile.workplace_adjustments_other,
      hasDrivingLicence: profile.has_driving_licence,
      workPreferences: profile.work_preferences ? unmapWorkPreferences(profile.work_preferences) : undefined,
      openToRelocation: profile.open_to_relocation,
      availabilityStatus: profile.availability_status as 'actively_looking' | 'open_to_opportunities' | 'not_looking',
      profileCompletionPercentage: profile.profile_completion_percentage
    };
  },
  
  getProfile: async (): Promise<SeekerProfile> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.user_metadata?.role !== 'seeker') {
      throw new Error('Only job seekers can access seeker profiles');
    }
    
    const { data: profile, error } = await supabase
      .from('seeker_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      throw new Error(`Profile not found: ${error.message}`);
    }
    
    return {
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: `${profile.first_name} ${profile.last_name}`.trim(),
      jobTitle: profile.job_title,
      headline: profile.headline,
      bio: profile.bio,
      keySkills: profile.key_skills,
      locationCity: profile.location_city,
      locationCountry: profile.location_country,
      availabilityStatus: profile.availability_status as 'actively_looking' | 'open_to_opportunities' | 'not_looking',
      profileCompletionPercentage: profile.profile_completion_percentage,
    };
  },
  
  updateProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.user_metadata?.role !== 'seeker') {
      throw new Error('Only job seekers can update seeker profiles');
    }
    
    const updateData: any = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      job_title: profileData.jobTitle,
      headline: profileData.headline,
      bio: profileData.bio,
      key_skills: profileData.keySkills,
      location_city: profileData.locationCity,
      location_country: profileData.locationCountry,
      profile_image_url: profileData.profilePictureUrl,
      phone_number: profileData.phone,
      email: profileData.email,
      work_preferences: profileData.workPreferences ? mapWorkPreferences(profileData.workPreferences) : null,
    };
    
    // Calculate completion percentage
    const totalFields = 12;
    let filledFields = 0;
    
    if (updateData.first_name) filledFields++;
    if (updateData.last_name) filledFields++;
    if (updateData.job_title) filledFields++;
    if (updateData.headline) filledFields++;
    if (updateData.bio) filledFields++;
    if (updateData.key_skills && updateData.key_skills.length > 0) filledFields++;
    if (updateData.location_city) filledFields++;
    if (updateData.location_country) filledFields++;
    if (updateData.profile_image_url) filledFields++;
    if (updateData.phone_number) filledFields++;
    if (updateData.email) filledFields++;
    if (updateData.work_preferences && updateData.work_preferences.length > 0) filledFields++;
    
    updateData.profile_completion_percentage = Math.round((filledFields / totalFields) * 100);
    
    const { data: profile, error } = await supabase
      .from('seeker_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    
    return {
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: `${profile.first_name} ${profile.last_name}`.trim(),
      jobTitle: profile.job_title,
      headline: profile.headline,
      bio: profile.bio,
      keySkills: profile.key_skills,
      locationCity: profile.location_city,
      locationCountry: profile.location_country,
      profilePictureUrl: profile.profile_image_url,
      phone: profile.phone_number,
      email: profile.email,
      workPreferences: profile.work_preferences ? unmapWorkPreferences(profile.work_preferences) : undefined,
      availabilityStatus: profile.availability_status as 'actively_looking' | 'open_to_opportunities' | 'not_looking',
      profileCompletionPercentage: profile.profile_completion_percentage,
    };
  }
};
