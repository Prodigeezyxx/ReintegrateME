
import { SeekerProfile } from '../models/types';
import { generateId } from './types';
import { getCurrentUser, getDatabase } from './database';

export const seekerAPI = {
  createInitialProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const currentUser = getCurrentUser();
    const { seekerProfiles } = getDatabase();
    
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can create a seeker profile');
    }
    
    const newProfile: SeekerProfile = {
      id: generateId(),
      userId: currentUser.id,
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      displayName: profileData.firstName ? `${profileData.firstName} ${profileData.lastName || ''}` : '',
      jobTitle: profileData.jobTitle,
      headline: profileData.headline,
      bio: profileData.bio,
      keySkills: profileData.keySkills || [],
      locationCity: profileData.locationCity,
      locationCountry: profileData.locationCountry,
      availabilityStatus: 'actively_looking',
      profileCompletionPercentage: profileData.keySkills && profileData.keySkills.length > 0 ? 40 : 30,
    };
    
    seekerProfiles.push(newProfile);
    currentUser.profileId = newProfile.id;
    
    return newProfile;
  },
  
  completeProfileSetup: async (allSetupData: any): Promise<SeekerProfile> => {
    const currentUser = getCurrentUser();
    const { seekerProfiles } = getDatabase();
    
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can complete profile setup');
    }
    
    let profile = seekerProfiles.find(p => p.userId === currentUser?.id);
    
    if (!profile) {
      profile = {
        id: generateId(),
        userId: currentUser.id,
        firstName: allSetupData.firstName || '',
        lastName: allSetupData.lastName || '',
        displayName: `${allSetupData.firstName || ''} ${allSetupData.lastName || ''}`.trim(),
        jobTitle: allSetupData.jobTitle,
        headline: allSetupData.headline,
        sentenceCompleted: allSetupData.sentenceCompleted,
        currentLegalSupervision: allSetupData.currentLegalSupervision,
        convictionTypes: allSetupData.convictionTypes,
        convictionStatus: allSetupData.convictionStatus,
        convictionOtherDetails: allSetupData.convictionOtherDetails,
        barredFromRegulatedWork: allSetupData.barredFromRegulatedWork,
        onDbsBarringList: allSetupData.onDbsBarringList,
        mappaLevel: allSetupData.mappaLevel,
        relevantForSafeguardingChecks: allSetupData.relevantForSafeguardingChecks,
        hasDisability: allSetupData.hasDisability,
        disabilityTypes: allSetupData.disabilityTypes,
        disabilityOtherDetails: allSetupData.disabilityOtherDetails,
        workplaceAdjustments: allSetupData.workplaceAdjustments,
        workplaceAdjustmentsOther: allSetupData.workplaceAdjustmentsOther,
        hasDrivingLicence: allSetupData.hasDrivingLicence,
        workPreferences: allSetupData.workPreferences,
        openToRelocation: allSetupData.openToRelocation,
        availabilityStatus: 'actively_looking',
        profileCompletionPercentage: 85
      };
      
      seekerProfiles.push(profile);
      currentUser.profileId = profile.id;
    } else {
      Object.assign(profile, allSetupData);
      profile.displayName = `${profile.firstName} ${profile.lastName}`.trim();
      profile.profileCompletionPercentage = 85;
    }
    
    return profile;
  },
  
  getProfile: async (): Promise<SeekerProfile> => {
    const currentUser = getCurrentUser();
    const { seekerProfiles } = getDatabase();
    
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can access seeker profiles');
    }
    
    const profile = seekerProfiles.find(p => p.userId === currentUser?.id);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return profile;
  },
  
  updateProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const currentUser = getCurrentUser();
    const { seekerProfiles } = getDatabase();
    
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can update seeker profiles');
    }
    
    const profile = seekerProfiles.find(p => p.userId === currentUser?.id);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    Object.assign(profile, profileData);
    
    if (profileData.firstName || profileData.lastName) {
      profile.displayName = `${profile.firstName} ${profile.lastName}`;
    }
    
    const totalFields = 12;
    let filledFields = 0;
    
    if (profile.firstName) filledFields++;
    if (profile.lastName) filledFields++;
    if (profile.jobTitle) filledFields++;
    if (profile.headline) filledFields++;
    if (profile.bio) filledFields++;
    if (profile.keySkills && profile.keySkills.length > 0) filledFields++;
    if (profile.locationCity) filledFields++;
    if (profile.locationCountry) filledFields++;
    if (profile.profilePictureUrl) filledFields++;
    if (profile.phone) filledFields++;
    if (profile.email) filledFields++;
    if (profile.workPreferences && profile.workPreferences.length > 0) filledFields++;
    
    profile.profileCompletionPercentage = Math.round((filledFields / totalFields) * 100);
    
    return profile;
  }
};
