
import { User, UserRole, SeekerProfile, CompanyProfile, JobPosting, SwipeableCardData, MatchRecord } from '../models/types';

// Mock data and functions to simulate API calls
// In a real implementation, these would be actual API calls to your backend

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock database
const seekerProfiles: SeekerProfile[] = [];
const companyProfiles: CompanyProfile[] = [];
const jobPostings: JobPosting[] = [];
const matches: MatchRecord[] = [];

// New unified swipe system
interface SwipeRecord {
  id: string;
  swiperId: string;
  swipedEntityId: string;
  swipedEntityType: 'seeker' | 'job';
  swipeType: 'like' | 'pass' | 'super_like';
  contextJobId?: string;
  hirerCompanyId?: string;
  timestamp: Date;
}

const swipeRecords: SwipeRecord[] = [];

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

// Sample skills
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

// Company Profile API
export const companyAPI = {
  // Create initial company profile
  createInitialProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    const newProfile: CompanyProfile = {
      id: generateId(),
      userId: 'current-user-id', // This would come from auth context
      companyName: profileData.companyName || '',
      industry: profileData.industry,
      companySize: profileData.companySize,
      websiteUrl: profileData.websiteUrl,
      description: profileData.description,
      locationCity: profileData.locationCity,
      locationCountry: profileData.locationCountry,
      profileCompletionPercentage: 30, // Initial completion percentage
    };
    
    companyProfiles.push(newProfile);
    
    return newProfile;
  },
  
  getProfile: async (): Promise<CompanyProfile> => {
    const profile = companyProfiles.find(p => p.userId === 'current-user-id');
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return profile;
  },
  
  updateProfile: async (profileData: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    const profile = companyProfiles.find(p => p.userId === 'current-user-id');
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Update profile fields
    Object.assign(profile, profileData);
    
    // Recalculate completion percentage based on filled fields
    const totalFields = 8; // Total number of optional fields
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

// Seeker Profile API
export const seekerAPI = {
  // Create initial seeker profile
  createInitialProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const newProfile: SeekerProfile = {
      id: generateId(),
      userId: 'current-user-id', // This would come from auth context
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      displayName: profileData.firstName ? `${profileData.firstName} ${profileData.lastName || ''}` : '',
      headline: profileData.headline,
      bio: profileData.bio,
      keySkills: profileData.keySkills,
      locationCity: profileData.locationCity,
      locationCountry: profileData.locationCountry,
      preferredJobCategories: profileData.preferredJobCategories,
      preferredEmploymentTypes: profileData.preferredEmploymentTypes,
      availabilityStatus: 'actively_looking',
      profileCompletionPercentage: 30, // Initial completion percentage
    };
    
    seekerProfiles.push(newProfile);
    
    return newProfile;
  },
  
  getProfile: async (): Promise<SeekerProfile> => {
    const profile = seekerProfiles.find(p => p.userId === 'current-user-id');
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return profile;
  },
  
  updateProfile: async (profileData: Partial<SeekerProfile>): Promise<SeekerProfile> => {
    const profile = seekerProfiles.find(p => p.userId === 'current-user-id');
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Update profile fields
    Object.assign(profile, profileData);
    
    // If first name or last name is updated, update display name as well
    if (profileData.firstName || profileData.lastName) {
      profile.displayName = `${profile.firstName} ${profile.lastName}`;
    }
    
    // Recalculate completion percentage based on filled fields
    const totalFields = 10; // Total number of optional fields
    let filledFields = 0;
    
    if (profile.firstName) filledFields++;
    if (profile.lastName) filledFields++;
    if (profile.headline) filledFields++;
    if (profile.bio) filledFields++;
    if (profile.keySkills && profile.keySkills.length > 0) filledFields++;
    if (profile.locationCity) filledFields++;
    if (profile.locationCountry) filledFields++;
    if (profile.preferredJobCategories && profile.preferredJobCategories.length > 0) filledFields++;
    if (profile.preferredEmploymentTypes && profile.preferredEmploymentTypes.length > 0) filledFields++;
    if (profile.profilePictureUrl) filledFields++;
    
    profile.profileCompletionPercentage = Math.round((filledFields / totalFields) * 100);
    
    return profile;
  }
};

// Job API
export const jobAPI = {
  // Create job posting
  createJob: async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
    // Get company profile
    const companyProfile = companyProfiles.find(p => p.userId === 'current-user-id');
    
    if (!companyProfile) {
      throw new Error('Company profile not found');
    }
    
    const newJob: JobPosting = {
      id: generateId(),
      hirerId: 'current-user-id',
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
      requiredSkills: jobData.requiredSkills,
      salary: jobData.salary,
      createdAt: new Date(),
      status: jobData.status as 'active' | 'draft' | 'archived' | undefined,
    };
    
    jobPostings.push(newJob);
    
    return newJob;
  },
  
  getHirerJobs: async (): Promise<JobPosting[]> => {
    return jobPostings.filter(job => job.hirerId === 'current-user-id');
  },
  
  getJobsFeed: async (): Promise<SwipeableCardData[]> => {
    // Populate with some demo jobs if empty
    if (jobPostings.length === 0) {
      const demoJobs = [
        {
          id: generateId(),
          hirerId: 'demo',
          companyId: 'demo',
          title: 'Construction Worker',
          description: 'Looking for experienced construction workers for commercial building projects in Central London.',
          companyName: 'BuildRight Construction',
          companyLogoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center',
          category: 'Construction',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level to Mid-level',
          locationCity: 'London',
          locationCountry: 'United Kingdom',
          requiredSkills: ['Physical Stamina', 'Tool Knowledge', 'Health & Safety Awareness'],
          createdAt: new Date(),
          status: 'active' as const,
          salary: {
            min: 22000,
            max: 30000,
            currency: 'GBP',
            period: 'annual'
          }
        },
        {
          id: generateId(),
          hirerId: 'demo',
          companyId: 'demo',
          title: 'Electrician',
          description: 'Join our team of skilled electricians for residential and commercial projects throughout Greater Manchester.',
          companyName: 'PowerUp Electric',
          companyLogoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&h=100&fit=crop&crop=center',
          category: 'Construction',
          employmentType: 'Full-time',
          experienceLevel: 'Mid-level',
          locationCity: 'Manchester',
          locationCountry: 'United Kingdom',
          requiredSkills: ['Electrical Systems', 'Wiring', 'Troubleshooting'],
          createdAt: new Date(),
          status: 'active' as const,
          salary: {
            min: 25000,
            max: 35000,
            currency: 'GBP',
            period: 'annual'
          }
        },
        {
          id: generateId(),
          hirerId: 'demo',
          companyId: 'demo',
          title: 'Delivery Driver',
          description: 'Local delivery routes throughout Birmingham, company vehicle provided. Must have valid UK driving license.',
          companyName: 'Swift Logistics',
          companyLogoUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=center',
          category: 'Transportation',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level',
          locationCity: 'Birmingham',
          locationCountry: 'United Kingdom',
          requiredSkills: ['Clean Driving Licence', 'Navigation Skills', 'Time Management'],
          createdAt: new Date(),
          status: 'active' as const,
          salary: {
            min: 21000,
            max: 24000,
            currency: 'GBP',
            period: 'annual'
          }
        }
      ];
      
      jobPostings.push(...demoJobs);
    }
    
    // Convert job postings to swipeable card data
    return jobPostings.map(job => ({
      id: job.id,
      type: 'job',
      primaryImageUrl: job.companyLogoUrl,
      titleText: job.title,
      subtitleText: job.companyName,
      detailLine1: `${job.locationCity}, ${job.locationCountry}`,
      detailLine2: job.employmentType,
      tags: job.requiredSkills || []
    }));
  },
  
  getSeekersFeed: async (): Promise<SwipeableCardData[]> => {
    // Populate with some demo seekers if empty
    if (seekerProfiles.length === 0) {
      const demoSeekers = [
        {
          id: generateId(),
          userId: 'demo1',
          firstName: 'Michael',
          lastName: 'Roberts',
          displayName: 'Michael Roberts',
          profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          headline: 'Experienced Carpenter',
          keySkills: ['Carpentry', 'Framing', 'Finishing Work'],
          locationCity: 'Bristol',
          locationCountry: 'United Kingdom',
        },
        {
          id: generateId(),
          userId: 'demo2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          displayName: 'Sarah Johnson',
          profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop&crop=face',
          headline: 'Licensed Electrician',
          keySkills: ['Electrical Systems', 'Wiring', 'Circuits'],
          locationCity: 'London',
          locationCountry: 'United Kingdom',
        },
        {
          id: generateId(),
          userId: 'demo3',
          firstName: 'Robert',
          lastName: 'Chen',
          displayName: 'Robert Chen',
          profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
          headline: 'HVAC Technician',
          keySkills: ['HVAC', 'Refrigeration', 'Maintenance'],
          locationCity: 'Glasgow',
          locationCountry: 'United Kingdom',
        },
        {
          id: generateId(),
          userId: 'demo4',
          firstName: 'Lisa',
          lastName: 'Martinez',
          displayName: 'Lisa Martinez',
          profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
          headline: 'Commercial Driver',
          keySkills: ['HGV Licence', 'Logistics', 'Safety Compliance'],
          locationCity: 'Edinburgh',
          locationCountry: 'United Kingdom',
        },
        {
          id: generateId(),
          userId: 'demo5',
          firstName: 'James',
          lastName: 'Wilson',
          displayName: 'James Wilson',
          profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
          headline: 'Skilled Plumber',
          keySkills: ['Plumbing', 'Pipe Fitting', 'Repairs'],
          locationCity: 'Leeds',
          locationCountry: 'United Kingdom',
        },
        {
          id: generateId(),
          userId: 'demo6',
          firstName: 'Emma',
          lastName: 'Thompson',
          displayName: 'Emma Thompson',
          profilePictureUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&h=200&fit=crop&crop=face',
          headline: 'Retail Supervisor',
          keySkills: ['Customer Service', 'Stock Management', 'Team Leadership'],
          locationCity: 'Sheffield',
          locationCountry: 'United Kingdom',
        }
      ];
      
      seekerProfiles.push(...demoSeekers);
    }
    
    // Convert seeker profiles to swipeable card data
    return seekerProfiles.map(profile => ({
      id: profile.id,
      type: 'seeker',
      primaryImageUrl: profile.profilePictureUrl,
      titleText: profile.displayName,
      subtitleText: profile.headline,
      detailLine1: profile.locationCity && profile.locationCountry ? `${profile.locationCity}, ${profile.locationCountry}` : undefined,
      tags: profile.keySkills || []
    }));
  },

  // Get saved profiles for hirer
  getSavedProfiles: async (): Promise<SwipeableCardData[]> => {
    // Get all liked swipes by this hirer
    const likedSwipes = swipeRecords.filter(swipe => 
      swipe.swiperId === 'current-user-id' && 
      swipe.swipedEntityType === 'seeker' && 
      (swipe.swipeType === 'like' || swipe.swipeType === 'super_like')
    );

    // Get the corresponding seeker profiles
    const savedProfiles: SwipeableCardData[] = [];
    for (const swipe of likedSwipes) {
      const seekerProfile = seekerProfiles.find(profile => profile.id === swipe.swipedEntityId);
      if (seekerProfile) {
        savedProfiles.push({
          id: seekerProfile.id,
          type: 'seeker',
          primaryImageUrl: seekerProfile.profilePictureUrl,
          titleText: seekerProfile.displayName,
          subtitleText: seekerProfile.headline,
          detailLine1: seekerProfile.locationCity && seekerProfile.locationCountry ? `${seekerProfile.locationCity}, ${seekerProfile.locationCountry}` : undefined,
          tags: seekerProfile.keySkills || []
        });
      }
    }

    return savedProfiles;
  },

  // Get saved jobs for seeker
  getSavedJobs: async (): Promise<SwipeableCardData[]> => {
    // Get all liked swipes by this seeker
    const likedSwipes = swipeRecords.filter(swipe => 
      swipe.swiperId === 'current-user-id' && 
      swipe.swipedEntityType === 'job' && 
      (swipe.swipeType === 'like' || swipe.swipeType === 'super_like')
    );

    // Get the corresponding job postings
    const savedJobs: SwipeableCardData[] = [];
    for (const swipe of likedSwipes) {
      const job = jobPostings.find(job => job.id === swipe.swipedEntityId);
      if (job) {
        savedJobs.push({
          id: job.id,
          type: 'job',
          primaryImageUrl: job.companyLogoUrl,
          titleText: job.title,
          subtitleText: job.companyName,
          detailLine1: `${job.locationCity}, ${job.locationCountry}`,
          detailLine2: job.employmentType,
          tags: job.requiredSkills || []
        });
      }
    }

    return savedJobs;
  }
};

// Enhanced Swipe API with unified system
export const swipeAPI = {
  // Process swipe with unified system
  processSwipe: async (
    swipedEntityId: string, 
    swipedEntityType: 'seeker' | 'job', 
    swipeType: 'like' | 'pass' | 'super_like', 
    contextJobId?: string
  ): Promise<{ isMatch: boolean, match?: MatchRecord }> => {
    // Create swipe record
    const swipeRecord: SwipeRecord = {
      id: generateId(),
      swiperId: 'current-user-id',
      swipedEntityId,
      swipedEntityType,
      swipeType,
      contextJobId,
      timestamp: new Date()
    };

    // Add company context for hirer swipes
    const companyProfile = companyProfiles.find(p => p.userId === 'current-user-id');
    if (companyProfile) {
      swipeRecord.hirerCompanyId = companyProfile.id;
    }

    swipeRecords.push(swipeRecord);

    // Check for mutual match only on likes
    if (swipeType === 'like' || swipeType === 'super_like') {
      const match = await checkForMutualMatch(swipeRecord);
      if (match) {
        matches.push(match);
        return { isMatch: true, match };
      }
    }

    return { isMatch: false };
  },

  // Get matches for current user
  getMatches: async (): Promise<MatchRecord[]> => {
    return matches.filter(m => m.hirerId === 'current-user-id' || m.seekerId === 'current-user-id');
  },

  // Get swipe history for current user
  getSwipeHistory: async (): Promise<SwipeRecord[]> => {
    return swipeRecords.filter(swipe => swipe.swiperId === 'current-user-id');
  }
};

// Helper function to check for mutual matches
async function checkForMutualMatch(currentSwipe: SwipeRecord): Promise<MatchRecord | null> {
  // Simplified match logic for demo purposes
  // In a real app, this would check against actual user data
  return null;
}
