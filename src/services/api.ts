
import { User, UserRole, SeekerProfile, CompanyProfile, JobPosting, SwipeableCardData, MatchRecord } from '../models/types';

// Mock data and functions to simulate API calls
// In a real implementation, these would be actual API calls to your backend

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

// Authentication API
export const authAPI = {
  // Sign up with email and role
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
  
  // New: Sign up with email without role assignment
  signupEmailWithoutRole: async (email: string, password: string): Promise<User> => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user without role - they'll select it later
    const newUser: User = {
      id: generateId(),
      email,
      role: undefined as any, // Temporarily undefined until role selection
      createdAt: new Date()
    };
    
    users.push(newUser);
    currentUser = newUser;
    
    return newUser;
  },
  
  // Update user role
  updateUserRole: async (role: UserRole): Promise<User> => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    // Update the user's role
    currentUser.role = role;
    
    // Update in the users array
    const userIndex = users.findIndex(u => u.id === currentUser?.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...currentUser };
    }
    
    return currentUser;
  },
  
  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    // In a real app, you would verify the password
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    currentUser = user;
    return user;
  },
  
  // Log out
  logout: () => {
    currentUser = null;
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    return currentUser;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return currentUser !== null;
  }
};

// Company Profile API
export const companyAPI = {
  // Create initial company profile
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
      profileCompletionPercentage: 30, // Initial completion percentage
    };
    
    companyProfiles.push(newProfile);
    
    // Update user with profile ID
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
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can create a seeker profile');
    }
    
    const newProfile: SeekerProfile = {
      id: generateId(),
      userId: currentUser.id,
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
    
    // Update user with profile ID
    currentUser.profileId = newProfile.id;
    
    return newProfile;
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
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can create job postings');
    }
    
    // Get company profile
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
      requiredSkills: jobData.requiredSkills,
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
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access seeker feed');
    }

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
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access saved profiles');
    }

    // Get all liked swipes by this hirer
    const likedSwipes = swipeRecords.filter(swipe => 
      swipe.swiperId === currentUser?.id && 
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
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can access saved jobs');
    }

    // Get all liked swipes by this seeker
    const likedSwipes = swipeRecords.filter(swipe => 
      swipe.swiperId === currentUser?.id && 
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
    if (!currentUser) {
      throw new Error('User must be authenticated to swipe');
    }

    // Create swipe record
    const swipeRecord: SwipeRecord = {
      id: generateId(),
      swiperId: currentUser.id,
      swipedEntityId,
      swipedEntityType,
      swipeType,
      contextJobId,
      timestamp: new Date()
    };

    // Add company context for hirer swipes
    if (currentUser.role === 'hirer') {
      const companyProfile = companyProfiles.find(p => p.userId === currentUser?.id);
      if (companyProfile) {
        swipeRecord.hirerCompanyId = companyProfile.id;
      }
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
    if (!currentUser) {
      throw new Error('User must be authenticated to get matches');
    }

    if (currentUser.role === 'hirer') {
      return matches.filter(m => m.hirerId === currentUser?.id);
    } else {
      return matches.filter(m => m.seekerId === currentUser?.id);
    }
  },

  // Get swipe history for current user
  getSwipeHistory: async (): Promise<SwipeRecord[]> => {
    if (!currentUser) {
      throw new Error('User must be authenticated to get swipe history');
    }

    return swipeRecords.filter(swipe => swipe.swiperId === currentUser?.id);
  }
};

// Helper function to check for mutual matches
async function checkForMutualMatch(currentSwipe: SwipeRecord): Promise<MatchRecord | null> {
  if (!currentUser) return null;

  if (currentUser.role === 'hirer' && currentSwipe.swipedEntityType === 'seeker') {
    // Hirer liked a seeker - check if seeker liked any of this hirer's jobs
    const seekerProfile = seekerProfiles.find(p => p.id === currentSwipe.swipedEntityId);
    if (!seekerProfile) return null;

    const hirerJobs = jobPostings.filter(job => job.hirerId === currentUser?.id);
    
    // Check if seeker has liked any of the hirer's jobs
    const mutualSwipe = swipeRecords.find(swipe => 
      swipe.swiperId === seekerProfile.userId &&
      swipe.swipedEntityType === 'job' &&
      (swipe.swipeType === 'like' || swipe.swipeType === 'super_like') &&
      hirerJobs.some(job => job.id === swipe.swipedEntityId)
    );

    if (mutualSwipe) {
      const matchedJob = hirerJobs.find(job => job.id === mutualSwipe.swipedEntityId);
      const companyProfile = companyProfiles.find(p => p.userId === currentUser?.id);
      
      return {
        id: generateId(),
        hirerId: currentUser.id,
        seekerId: seekerProfile.userId,
        hirerCompanyName: companyProfile?.companyName || 'Company',
        seekerDisplayName: seekerProfile.displayName,
        contextJobId: matchedJob?.id,
        contextJobTitle: matchedJob?.title,
        matchTimestamp: new Date()
      };
    }
  } else if (currentUser.role === 'seeker' && currentSwipe.swipedEntityType === 'job') {
    // Seeker liked a job - check if hirer has liked this seeker
    const likedJob = jobPostings.find(job => job.id === currentSwipe.swipedEntityId);
    if (!likedJob) return null;

    const seekerProfile = seekerProfiles.find(p => p.userId === currentUser?.id);
    if (!seekerProfile) return null;

    // Check if hirer has liked this seeker
    const mutualSwipe = swipeRecords.find(swipe => 
      swipe.swiperId === likedJob.hirerId &&
      swipe.swipedEntityType === 'seeker' &&
      (swipe.swipeType === 'like' || swipe.swipeType === 'super_like') &&
      swipe.swipedEntityId === seekerProfile.id
    );

    if (mutualSwipe) {
      const companyProfile = companyProfiles.find(p => p.userId === likedJob.hirerId);
      
      return {
        id: generateId(),
        hirerId: likedJob.hirerId,
        seekerId: currentUser.id,
        hirerCompanyName: companyProfile?.companyName || likedJob.companyName,
        seekerDisplayName: seekerProfile.displayName,
        contextJobId: likedJob.id,
        contextJobTitle: likedJob.title,
        matchTimestamp: new Date()
      };
    }
  }

  return null;
}
