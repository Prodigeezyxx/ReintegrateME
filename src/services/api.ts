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

// New: Track swipes for better matching logic
interface SwipeRecord {
  id: string;
  swiperId: string;
  swipedEntityId: string;
  swipedEntityType: 'seeker' | 'job';
  swipeType: 'like' | 'pass' | 'super_like';
  contextJobId?: string;
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

// Initialize mock jobs for guest users
const initializeMockJobs = () => {
  if (jobPostings.length === 0) {
    const mockJobs = [
      {
        id: generateId(),
        hirerId: 'guest-hirer',
        companyId: 'guest-company',
        title: 'Senior Construction Worker',
        description: 'We are looking for an experienced construction worker to join our team on various commercial projects in London.',
        companyName: 'BuildPro Construction Ltd',
        companyLogoUrl: 'https://placehold.co/100x100?text=BP',
        category: 'Construction',
        employmentType: 'Full-time',
        experienceLevel: 'Mid-level',
        locationCity: 'London',
        locationCountry: 'United Kingdom',
        requiredSkills: ['Construction Experience', 'Health & Safety', 'Physical Fitness'],
        salary: {
          min: 25000,
          max: 32000,
          currency: 'GBP',
          period: 'annual'
        },
        createdAt: new Date(),
        status: 'active' as const,
      },
      {
        id: generateId(),
        hirerId: 'guest-hirer',
        companyId: 'guest-company',
        title: 'Electrician - Residential Projects',
        description: 'Join our electrical team working on residential installations and maintenance across Manchester.',
        companyName: 'PowerTech Solutions',
        companyLogoUrl: 'https://placehold.co/100x100?text=PT',
        category: 'Construction',
        employmentType: 'Full-time',
        experienceLevel: 'Mid-level',
        locationCity: 'Manchester',
        locationCountry: 'United Kingdom',
        requiredSkills: ['Electrical Installation', '18th Edition', 'Testing & Inspection'],
        salary: {
          min: 28000,
          max: 38000,
          currency: 'GBP',
          period: 'annual'
        },
        createdAt: new Date(),
        status: 'active' as const,
      },
      {
        id: generateId(),
        hirerId: 'guest-hirer',
        companyId: 'guest-company',
        title: 'Warehouse Operative',
        description: 'Immediate start available for warehouse operative role with forklift training provided.',
        companyName: 'LogiFlow Warehouse',
        companyLogoUrl: 'https://placehold.co/100x100?text=LF',
        category: 'Logistics',
        employmentType: 'Full-time',
        experienceLevel: 'Entry-level',
        locationCity: 'Birmingham',
        locationCountry: 'United Kingdom',
        requiredSkills: ['Physical Fitness', 'Attention to Detail', 'Team Work'],
        createdAt: new Date(),
        status: 'draft' as const,
      }
    ];
    
    jobPostings.push(...mockJobs);
  }
};

// Authentication API
export const authAPI = {
  // Sign up with email
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
  
  // Get company profile
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
  
  // Update company profile
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
  
  // Get seeker profile
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
  
  // Update seeker profile
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
  
  // Get jobs for hirer - Updated to handle guest users without errors
  getHirerJobs: async (): Promise<JobPosting[]> => {
    // Initialize mock jobs if needed
    initializeMockJobs();
    
    // For guest users or when no current user, return mock jobs
    if (!currentUser) {
      return jobPostings.filter(job => job.hirerId === 'guest-hirer');
    }
    
    if (currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access their job postings');
    }
    
    // For guest users (identified by isGuest property), return mock jobs
    if ((currentUser as any).isGuest) {
      return jobPostings.filter(job => job.hirerId === 'guest-hirer');
    }
    
    // For real users, return their actual jobs
    return jobPostings.filter(job => job.hirerId === currentUser?.id);
  },
  
  // Get jobs for seeker feed
  getJobsFeed: async (): Promise<SwipeableCardData[]> => {
    if (!currentUser || currentUser.role !== 'seeker') {
      throw new Error('Only job seekers can access job feed');
    }

    // Initialize mock jobs if needed
    initializeMockJobs();
    
    // Filter out jobs the user has already swiped on
    const userSwipes = swipeRecords.filter(record => 
      record.swiperId === currentUser?.id && record.swipedEntityType === 'job'
    );
    const swipedJobIds = userSwipes.map(swipe => swipe.swipedEntityId);
    
    const availableJobs = jobPostings.filter(job => 
      !swipedJobIds.includes(job.id) && job.status === 'active'
    );
    
    // Convert job postings to swipeable card data
    return availableJobs.map(job => ({
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
  
  // Get seekers for hirer feed
  getSeekersFeed: async (): Promise<SwipeableCardData[]> => {
    // Initialize mock seekers if empty
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
          profilePictureUrl: 'https://placehold.co/200x200?text=SJ',
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
          profilePictureUrl: 'https://placehold.co/200x200?text=RC',
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
          profilePictureUrl: 'https://placehold.co/200x200?text=LM',
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
          profilePictureUrl: 'https://placehold.co/200x200?text=JW',
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
          profilePictureUrl: 'https://placehold.co/200x200?text=ET',
          headline: 'Retail Supervisor',
          keySkills: ['Customer Service', 'Stock Management', 'Team Leadership'],
          locationCity: 'Sheffield',
          locationCountry: 'United Kingdom',
        }
      ];
      
      seekerProfiles.push(...demoSeekers);
    }
    
    // Filter out seekers the current hirer has already swiped on
    const userSwipes = swipeRecords.filter(record => 
      record.swiperId === currentUser?.id && record.swipedEntityType === 'seeker'
    );
    const swipedSeekerIds = userSwipes.map(swipe => swipe.swipedEntityId);
    
    const availableSeekers = seekerProfiles.filter(seeker => 
      !swipedSeekerIds.includes(seeker.id)
    );
    
    // Convert seeker profiles to swipeable card data
    return availableSeekers.map(profile => ({
      id: profile.id,
      type: 'seeker',
      primaryImageUrl: profile.profilePictureUrl,
      titleText: profile.displayName,
      subtitleText: profile.headline,
      detailLine1: profile.locationCity && profile.locationCountry ? `${profile.locationCity}, ${profile.locationCountry}` : undefined,
      tags: profile.keySkills || []
    }));
  }
};

// Swipe API
export const swipeAPI = {
  // Process swipe with improved matching logic
  processSwipe: async (swipedEntityId: string, swipedEntityType: 'seeker' | 'job', swipeType: 'like' | 'pass' | 'super_like', contextJobId?: string): Promise<{ isMatch: boolean, match?: MatchRecord }> => {
    if (!currentUser) {
      throw new Error('User must be authenticated to swipe');
    }
    
    // Record the swipe
    const swipeRecord: SwipeRecord = {
      id: generateId(),
      swiperId: currentUser.id,
      swipedEntityId,
      swipedEntityType,
      swipeType,
      contextJobId,
      timestamp: new Date()
    };
    
    swipeRecords.push(swipeRecord);
    
    // Check for mutual match only on likes
    if (swipeType === 'like' || swipeType === 'super_like') {
      let isMatch = false;
      let match: MatchRecord | undefined;
      
      if (currentUser.role === 'hirer' && swipedEntityType === 'seeker') {
        // Check if the seeker has liked any of this hirer's jobs
        const seekerLikes = swipeRecords.filter(record =>
          record.swipedEntityType === 'job' &&
          (record.swipeType === 'like' || record.swipeType === 'super_like') &&
          jobPostings.some(job => job.id === record.swipedEntityId && job.hirerId === currentUser?.id)
        );
        
        const seekerUserId = seekerProfiles.find(p => p.id === swipedEntityId)?.userId;
        const mutualLike = seekerLikes.find(like => like.swiperId === seekerUserId);
        
        if (mutualLike) {
          isMatch = true;
          const seeker = seekerProfiles.find(p => p.id === swipedEntityId);
          const company = companyProfiles.find(p => p.userId === currentUser?.id);
          const job = jobPostings.find(j => j.id === mutualLike.swipedEntityId);
          
          if (seeker && company) {
            match = {
              id: generateId(),
              hirerId: currentUser.id,
              seekerId: seeker.userId,
              hirerCompanyName: company.companyName,
              seekerDisplayName: seeker.displayName,
              contextJobId: mutualLike.swipedEntityId,
              contextJobTitle: job?.title,
              matchTimestamp: new Date(),
            };
            
            matches.push(match);
          }
        }
      } else if (currentUser.role === 'seeker' && swipedEntityType === 'job') {
        // Check if the hirer has liked this seeker
        const job = jobPostings.find(j => j.id === swipedEntityId);
        if (job) {
          const hirerLikes = swipeRecords.filter(record =>
            record.swiperId === job.hirerId &&
            record.swipedEntityType === 'seeker' &&
            (record.swipeType === 'like' || record.swipeType === 'super_like')
          );
          
          const seekerProfile = seekerProfiles.find(p => p.userId === currentUser?.id);
          const mutualLike = hirerLikes.find(like => like.swipedEntityId === seekerProfile?.id);
          
          if (mutualLike && seekerProfile) {
            isMatch = true;
            const company = companyProfiles.find(p => p.userId === job.hirerId);
            
            if (company) {
              match = {
                id: generateId(),
                hirerId: job.hirerId,
                seekerId: currentUser.id,
                hirerCompanyName: company.companyName,
                seekerDisplayName: seekerProfile.displayName,
                contextJobId: job.id,
                contextJobTitle: job.title,
                matchTimestamp: new Date(),
              };
              
              matches.push(match);
            }
          }
        }
      }
      
      // Fallback: simulate occasional matches for demo purposes (10% chance)
      if (!isMatch && Math.random() < 0.1) {
        isMatch = true;
        // Create a demo match
        if (currentUser.role === 'hirer' && swipedEntityType === 'seeker') {
          const seeker = seekerProfiles.find(p => p.id === swipedEntityId);
          const company = companyProfiles.find(p => p.userId === currentUser?.id);
          
          if (seeker && company) {
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
            
            matches.push(match);
          }
        }
      }
      
      return { isMatch, match };
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
  
  // Get user's swipe history
  getSwipeHistory: async (): Promise<SwipeRecord[]> => {
    if (!currentUser) {
      throw new Error('User must be authenticated to get swipe history');
    }
    
    return swipeRecords.filter(record => record.swiperId === currentUser?.id);
  }
};
