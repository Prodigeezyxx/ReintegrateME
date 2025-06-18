
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
  }
};
