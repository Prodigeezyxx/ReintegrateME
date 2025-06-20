
import { supabase } from "@/integrations/supabase/client";

interface SeekerSetupData {
  // Step 1 data
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  headline?: string;
  keySkills?: string[];
  
  // Step 2 data
  sentenceCompleted?: boolean;
  currentLegalSupervision?: string;
  convictionTypes?: string[];
  convictionStatus?: string;
  convictionOtherDetails?: string;
  barredFromRegulatedWork?: boolean;
  onDbsBarringList?: boolean;
  mappaLevel?: string;
  relevantForSafeguardingChecks?: boolean;
  
  // Step 3 data
  hasDisability?: boolean;
  disabilityTypes?: string[];
  disabilityOtherDetails?: string;
  workplaceAdjustments?: string[];
  workplaceAdjustmentsOther?: string;
  
  // Step 4 data
  hasDrivingLicence?: boolean;
  workPreferences?: string[];
  openToRelocation?: boolean;
}

export const profileSetupManager = {
  // Save data for a specific step
  saveStepData: (step: number, data: Partial<SeekerSetupData>) => {
    const existingData = profileSetupManager.getAllData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem('seekerProfileSetup', JSON.stringify(updatedData));
  },
  
  // Get all saved data
  getAllData: (): SeekerSetupData => {
    try {
      const saved = localStorage.getItem('seekerProfileSetup');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading profile setup data:', error);
      return {};
    }
  },
  
  // Save all data to Supabase seeker_profiles table
  saveToDatabase: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = profileSetupManager.getAllData();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('seeker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const profileData = {
        user_id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        job_title: data.jobTitle,
        headline: data.headline,
        key_skills: data.keySkills || [],
        email: user.email,
        sentence_completed: data.sentenceCompleted,
        current_legal_supervision: data.currentLegalSupervision,
        conviction_types: data.convictionTypes || [],
        conviction_status: data.convictionStatus,
        conviction_other_details: data.convictionOtherDetails,
        barred_from_regulated_work: data.barredFromRegulatedWork,
        on_dbs_barring_list: data.onDbsBarringList,
        mappa_level: data.mappaLevel,
        relevant_for_safeguarding_checks: data.relevantForSafeguardingChecks,
        has_disability: data.hasDisability,
        disability_types: data.disabilityTypes || [],
        disability_other_details: data.disabilityOtherDetails,
        workplace_adjustments: data.workplaceAdjustments || [],
        workplace_adjustments_other: data.workplaceAdjustmentsOther,
        has_driving_licence: data.hasDrivingLicence,
        work_preferences: data.workPreferences || [],
        open_to_relocation: data.openToRelocation,
        profile_completion_percentage: profileSetupManager.calculateCompletionPercentage(),
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('seeker_profiles')
          .update(profileData)
          .eq('user_id', user.id);
      } else {
        // Create new profile
        result = await supabase
          .from('seeker_profiles')
          .insert([profileData]);
      }

      if (result.error) {
        console.error('Database save error:', result.error);
        return { success: false, error: result.error.message };
      }

      // Clear localStorage after successful save
      profileSetupManager.clearData();
      return { success: true };

    } catch (error) {
      console.error('Error saving to database:', error);
      return { success: false, error: 'Failed to save profile data' };
    }
  },
  
  // Calculate completion percentage based on filled fields
  calculateCompletionPercentage: (): number => {
    const data = profileSetupManager.getAllData();
    let completedFields = 0;
    let totalFields = 0;

    // Required fields (higher weight)
    const requiredFields = ['firstName', 'lastName'];
    requiredFields.forEach(field => {
      totalFields += 2; // Double weight for required fields
      if (data[field as keyof SeekerSetupData]) completedFields += 2;
    });

    // Optional but important fields
    const optionalFields = ['jobTitle', 'headline', 'keySkills', 'sentenceCompleted', 'currentLegalSupervision'];
    optionalFields.forEach(field => {
      totalFields += 1;
      const value = data[field as keyof SeekerSetupData];
      if (value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        completedFields += 1;
      }
    });

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  },
  
  // Clear all setup data
  clearData: () => {
    localStorage.removeItem('seekerProfileSetup');
  },
  
  // Check if required fields are filled
  validateRequiredFields: (): { isValid: boolean; missingFields: string[] } => {
    const data = profileSetupManager.getAllData();
    const missingFields: string[] = [];
    
    if (!data.firstName) missingFields.push('First Name');
    if (!data.lastName) missingFields.push('Last Name');
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  },

  // Get skills completion status
  getSkillsCompletionStatus: (): { hasSkills: boolean; skillCount: number } => {
    const data = profileSetupManager.getAllData();
    const skills = data.keySkills || [];
    return {
      hasSkills: skills.length > 0,
      skillCount: skills.length
    };
  }
};
