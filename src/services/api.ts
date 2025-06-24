import { User, UserRole, SeekerProfile, CompanyProfile, JobPosting, SwipeableCardData, MatchRecord } from '../models/types';
import { skillsDatabase, getAllSkills } from '../data/skillsDatabase';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Simulated current user
let currentUser: User | null = null;

// Mock database
const users: User[] = [];
const seekerProfiles: SeekerProfile[] = [];
const companyProfiles: CompanyProfile[] = [];
const jobPostings: JobPosting[] = [];
const matches: MatchRecord[] = [];

// Browser storage for images (fallback when Supabase storage fails)
const imageStorage = new Map<string, string>();

// Sample job categories
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

// Sample employment types
export const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Apprenticeship'
];

// Export skills from the comprehensive database
export const skills = getAllSkills().map(skill => skill.name);

// Sample countries
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

// Image storage helper functions
export const imageStorageAPI = {
  // Store image in browser memory
  storeImage: (key: string, imageData: string): void => {
    try {
      imageStorage.set(key, imageData);
      // Also try to store in localStorage for persistence
      localStorage.setItem(`img_${key}`, imageData);
    } catch (error) {
      console.warn('Failed to store image in localStorage:', error);
      // Fallback to memory only
      imageStorage.set(key, imageData);
    }
  },
  
  // Retrieve image from browser memory
  getImage: (key: string): string | null => {
    // First try memory
    let image = imageStorage.get(key);
    if (image) return image;
    
    // Then try localStorage
    try {
      image = localStorage.getItem(`img_${key}`);
      if (image) {
        imageStorage.set(key, image); // Cache in memory
        return image;
      }
    } catch (error) {
      console.warn('Failed to retrieve image from localStorage:', error);
    }
    
    return null;
  },
  
  // Convert file to base64 for storage
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

// Authentication API
export const authAPI = {
  signupEmail: async (role: UserRole, email: string, password: string): Promise<User> => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: generateId(),
      email,
      role,
      createdAt: new Date()
    };
    
    users.push(newUser);
    currentUser = newUser;
    
    return newUser;
  },
  
  login: async (email: string, password: string): Promise<User> => {
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    currentUser = user;
    return user;
  },
  
  logout: () => {
    currentUser = null;
  },
  
  getCurrentUser: (): User | null => {
    return currentUser;
  },
  
  isAuthenticated: (): boolean => {
    return currentUser !== null;
  }
};

// Company Profile API
export const companyAPI = {
  createInitialProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can create a company profile');
    }
    
    const newProfile: CompanyProfile = {
      id: generateId(),
      userId: currentUser.id,
      companyName: profileData.companyName || '',
      industry: profileData.industry,
      companySize: profileData.companySize,
      websiteUrl: profileData.websiteUrl,
      description: profileData.description,
      locationCity: profileData.locationCity,
      locationCountry: profileData.locationCountry,
      profileCompletionPercentage: 30,
    };
    
    companyProfiles.push(newProfile);
    currentUser.profileId = newProfile.id;
    
    return newProfile;
  },
  
  getProfile: async (): Promise<CompanyProfile> => {
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access company profiles');
    }
    
    const profile = companyProfiles.find(p => p.userId === currentUser?.id);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return profile;
  },
  
  updateProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can update company profiles');
    }
    
    const profile = companyProfiles.find(p => p.userId === currentUser?.id);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Update profile fields
    Object.assign(profile, profileData);
    
    // Recalculate completion percentage
    const totalFields = 8;
    let filledFields = 0;
    
    if (profile.companyName) filledFields++;
    if (profile.industry) filledFields++;
    if (profile.companySize) filledFields++;
    if (profile.websiteUrl) filledFields++;
    if (profile.description) filledFields++;
    if (profile.locationCity) filledFields++;
    if (profile.locationCountry) filledFields++;
    if (profile.logoUrl) filledFields++;
    
    profile.profileCompletionPercentage = Math.round((filledFields / totalFields) * 100);
    
    return profile;
  }
};

// Enhanced Seeker Profile API
export const seekerAPI = {
  createInitialProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
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

// Enhanced Job API
export const jobAPI = {
  createJob: async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can create job postings');
    }
    
    const companyProfile = companyProfiles.find(p => p.userId === currentUser?.id);
    
    if (!companyProfile) {
      throw new Error('Company profile not found');
    }
    
    const newJob: JobPosting = {
      id: generateId(),
      hirerId: currentUser.id,
      companyId: companyProfile.id,
      title: jobData.title || '',
      description: jobData.description || '',
      companyName: companyProfile.companyName,
      companyLogoUrl: companyProfile.logoUrl,
      category: jobData.category || '',
      employmentType: jobData.employmentType || '',
      experienceLevel: jobData.experienceLevel,
      locationCity: jobData.locationCity,
      locationCountry: jobData.locationCountry,
      requiredSkills: jobData.requiredSkills || [],
      salary: jobData.salary,
      createdAt: new Date(),
      status: jobData.status as 'active' | 'draft' | 'archived' | undefined,
    };
    
    jobPostings.push(newJob);
    
    return newJob;
  },
  
  getHirerJobs: async (): Promise<JobPosting[]> => {
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access their job postings');
    }
    
    return jobPostings.filter(job => job.hirerId === currentUser?.id);
  },
  
  getJobsFeed: async (): Promise<SwipeableCardData[]> => {
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can access job feed');
    }

    const seekerProfile = seekerProfiles.find(p => p.userId === currentUser?.id);
    const seekerSkills = seekerProfile?.keySkills || [];

    if (jobPostings.length === 0) {
      const demoJobs = [
        {
          id: generateId(),
          hirerId: 'demo',
          companyId: 'demo',
          title: 'Construction Worker',
          description: 'Looking for experienced construction workers for commercial building projects in Central London.',
          companyName: 'BuildRight Construction',
          companyLogoUrl: 'https://placehold.co/100x100?text=BC',
          category: 'Construction',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level to Mid-level',
          locationCity: 'London',
          locationCountry: 'United Kingdom',
          requiredSkills: ['cscs_labourer', 'bricklaying', 'time_management'],
          createdAt: new Date(),
          status: 'active' as const,
          salary: {
            min: 22000,
            max: 30000,
            currency: 'GBP',
          }
        },
        {
          id: generateId(),
          hirerId: 'demo',
          companyId: 'demo',
          title: 'Delivery Driver',
          description: 'Local delivery routes throughout Birmingham, company vehicle provided. Must have valid UK driving license.',
          companyName: 'Swift Logistics',
          companyLogoUrl: 'https://placehold.co/100x100?text=SL',
          category: 'Transportation',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level',
          locationCity: 'Birmingham',
          locationCountry: 'United Kingdom',
          requiredSkills: ['van_driving', 'route_planning', 'punctuality'],
          createdAt: new Date(),
          status: 'active' as const,
          salary: {
            min: 21000,
            max: 24000,
            currency: 'GBP',
          }
        }
      ];
      
      jobPostings.push(...demoJobs);
    }
    
    const jobCards = jobPostings.map(job => {
      const jobSkills = job.requiredSkills || [];
      const matchingSkills = jobSkills.filter(skill => seekerSkills.includes(skill));
      const matchPercentage = jobSkills.length > 0 ? (matchingSkills.length / jobSkills.length) * 100 : 0;
      
      return {
        id: job.id,
        type: 'job' as const,
        primaryImageUrl: job.companyLogoUrl,
        titleText: job.title,
        subtitleText: job.companyName,
        detailLine1: `${job.locationCity}, ${job.locationCountry}`,
        detailLine2: job.employmentType,
        tags: job.requiredSkills || [],
        skillMatchPercentage: Math.round(matchPercentage)
      };
    });

    return jobCards.sort((a, b) => (b.skillMatchPercentage || 0) - (a.skillMatchPercentage || 0));
  },
  
  getSeekersFeed: async (): Promise<SwipeableCardData[]> => {
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access seeker feed');
    }

    if (seekerProfiles.length === 0) {
      const demoSeekers = [
        {
          id: generateId(),
          userId: 'demo1',
          firstName: 'Michael',
          lastName: 'Roberts',
          displayName: 'Michael Roberts',
          profilePictureUrl: 'https://placehold.co/200x200?text=MR',
          headline: 'Experienced Carpenter',
          keySkills: ['carpentry_basic', 'teamwork', 'reliability'],
          locationCity: 'Bristol',
          locationCountry: 'United Kingdom',
        },
        {
          id: generateId(),
          userId: 'demo2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          displayName: 'Sarah Johnson',
          profilePictureUrl: 'https://placehold.co/200x200?text=SJ',
          headline: 'Licensed Driver & Warehouse Worker',
          keySkills: ['van_driving', 'warehouse_picking', 'punctuality'],
          locationCity: 'London',
          locationCountry: 'United Kingdom',
        }
      ];
      
      seekerProfiles.push(...demoSeekers);
    }
    
    return seekerProfiles.map(profile => ({
      id: profile.id,
      type: 'seeker' as const,
      primaryImageUrl: profile.profilePictureUrl,
      titleText: profile.displayName,
      subtitleText: profile.headline,
      detailLine1: profile.locationCity && profile.locationCountry ? `${profile.locationCity}, ${profile.locationCountry}` : undefined,
      tags: profile.keySkills || []
    }));
  }
};

// Enhanced Swipe API
export const swipeAPI = {
  processSwipe: async (swipedEntityId: string, swipedEntityType: 'seeker' | 'job', swipeType: 'like' | 'pass' | 'super_like', contextJobId?: string): Promise<{ isMatch: boolean, match?: MatchRecord }> => {
    if (!currentUser) {
      throw new Error('User must be authenticated to swipe');
    }
    
    const isLike = swipeType === 'like' || swipeType === 'super_like';
    
    let matchProbability = 0.3;
    
    if (currentUser.role === 'seeker' && swipedEntityType === 'job') {
      const job = jobPostings.find(j => j.id === swipedEntityId);
      const seekerProfile = seekerProfiles.find(p => p.userId === currentUser?.id);
      
      if (job && seekerProfile) {
        const jobSkills = job.requiredSkills || [];
        const seekerSkills = seekerProfile.keySkills || [];
        const matchingSkills = jobSkills.filter(skill => seekerSkills.includes(skill));
        
        if (jobSkills.length > 0) {
          const skillMatchRatio = matchingSkills.length / jobSkills.length;
          matchProbability = 0.2 + (skillMatchRatio * 0.6);
        }
      }
    }
    
    const randomMatch = Math.random() < matchProbability && isLike;
    
    if (randomMatch) {
      let match: MatchRecord;
      
      if (currentUser.role === 'hirer' && swipedEntityType === 'seeker') {
        const seeker = seekerProfiles.find(p => p.id === swipedEntityId);
        
        if (!seeker) {
          throw new Error('Seeker not found');
        }
        
        const company = companyProfiles.find(p => p.userId === currentUser?.id);
        
        if (!company) {
          throw new Error('Company profile not found');
        }
        
        match = {
          id: generateId(),
          hirerId: currentUser.id,
          seekerId: seeker.userId,
          hirerCompanyName: company.companyName,
          seekerDisplayName: seeker.displayName,
          contextJobId,
          contextJobTitle: contextJobId ? jobPostings.find(j => j.id === contextJobId)?.title : undefined,
          matchTimestamp: new Date(),
        };
        
      } else if (currentUser.role === 'seeker' && swipedEntityType === 'job') {
        const job = jobPostings.find(j => j.id === swipedEntityId);
        
        if (!job) {
          throw new Error('Job not found');
        }
        
        const seeker = seekerProfiles.find(p => p.userId === currentUser?.id);
        
        if (!seeker) {
          throw new Error('Seeker profile not found');
        }
        
        match = {
          id: generateId(),
          hirerId: job.hirerId,
          seekerId: currentUser.id,
          hirerCompanyName: job.companyName,
          seekerDisplayName: seeker.displayName,
          contextJobId: job.id,
          contextJobTitle: job.title,
          matchTimestamp: new Date(),
        };
        
      } else {
        throw new Error('Invalid swipe combination');
      }
      
      matches.push(match);
      
      return { isMatch: true, match };
    }
    
    return { isMatch: false };
  },
  
  getMatches: async (): Promise<MatchRecord[]> => {
    if (!currentUser) {
      throw new Error('User must be authenticated to get matches');
    }
    
    if (currentUser.role === 'hirer') {
      return matches.filter(m => m.hirerId === currentUser?.id);
    } else {
      return matches.filter(m => m.seekerId === currentUser?.id);
    }
  }
};
