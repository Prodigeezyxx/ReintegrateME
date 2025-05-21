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
  'Seasonal',
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
  'Commercial Driving',
  'Food Service',
  'Customer Service',
  'Equipment Maintenance',
  'Machinery Operation',
  'Safety Compliance'
];

// Sample countries
export const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'India',
  'Singapore',
  'Japan'
];

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
    };
    
    jobPostings.push(newJob);
    
    return newJob;
  },
  
  // Get jobs for hirer
  getHirerJobs: async (): Promise<JobPosting[]> => {
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access their job postings');
    }
    
    return jobPostings.filter(job => job.hirerId === currentUser?.id);
  },
  
  // Get jobs for seeker feed
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
          description: 'Looking for experienced construction workers for commercial building projects.',
          companyName: 'BuildRight Construction',
          companyLogoUrl: 'https://placehold.co/100x100?text=BC',
          category: 'Construction',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level to Mid-level',
          locationCity: 'Portland',
          locationCountry: 'United States',
          requiredSkills: ['Physical Stamina', 'Tool Knowledge', 'Safety Awareness'],
          createdAt: new Date(),
        },
        {
          id: generateId(),
          hirerId: 'demo',
          companyId: 'demo',
          title: 'Electrician',
          description: 'Join our team of skilled electricians for residential and commercial projects.',
          companyName: 'PowerUp Electric',
          companyLogoUrl: 'https://placehold.co/100x100?text=PE',
          category: 'Construction',
          employmentType: 'Full-time',
          experienceLevel: 'Mid-level',
          locationCity: 'Chicago',
          locationCountry: 'United States',
          requiredSkills: ['Electrical Systems', 'Wiring', 'Troubleshooting'],
          createdAt: new Date(),
        },
        {
          id: generateId(),
          hirerId: 'demo',
          companyId: 'demo',
          title: 'Delivery Driver',
          description: 'Local delivery routes, company vehicle provided.',
          companyName: 'Swift Logistics',
          companyLogoUrl: 'https://placehold.co/100x100?text=SL',
          category: 'Transportation',
          employmentType: 'Full-time',
          experienceLevel: 'Entry-level',
          locationCity: 'Dallas',
          locationCountry: 'United States',
          requiredSkills: ['Clean Driving Record', 'Navigation Skills', 'Time Management'],
          createdAt: new Date(),
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
  
  // Get seekers for hirer feed
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
          firstName: 'Mike',
          lastName: 'Rodriguez',
          displayName: 'Mike Rodriguez',
          profilePictureUrl: 'https://placehold.co/200x200?text=MR',
          headline: 'Experienced Carpenter',
          keySkills: ['Carpentry', 'Framing', 'Finishing Work'],
          locationCity: 'Seattle',
          locationCountry: 'United States',
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
          locationCity: 'Chicago',
          locationCountry: 'United States',
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
          locationCity: 'Houston',
          locationCountry: 'United States',
        },
        {
          id: generateId(),
          userId: 'demo4',
          firstName: 'Lisa',
          lastName: 'Martinez',
          displayName: 'Lisa Martinez',
          profilePictureUrl: 'https://placehold.co/200x200?text=LM',
          headline: 'Commercial Driver',
          keySkills: ['CDL', 'Logistics', 'Safety Compliance'],
          locationCity: 'Phoenix',
          locationCountry: 'United States',
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
          locationCity: 'Denver',
          locationCountry: 'United States',
        },
        {
          id: generateId(),
          userId: 'demo6',
          firstName: 'Emma',
          lastName: 'Thompson',
          displayName: 'Emma Thompson',
          profilePictureUrl: 'https://placehold.co/200x200?text=ET',
          headline: 'Retail Supervisor',
          keySkills: ['Customer Service', 'Inventory Management', 'Leadership'],
          locationCity: 'Miami',
          locationCountry: 'United States',
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
  }
};

// Swipe API
export const swipeAPI = {
  // Process swipe
  processSwipe: async (swipedEntityId: string, swipedEntityType: 'seeker' | 'job', swipeType: 'like' | 'pass' | 'super_like', contextJobId?: string): Promise<{ isMatch: boolean, match?: MatchRecord }> => {
    if (!currentUser) {
      throw new Error('User must be authenticated to swipe');
    }
    
    // For demonstration purposes, simulate a match on every 3rd like
    const isLike = swipeType === 'like' || swipeType === 'super_like';
    const randomMatch = Math.random() < 0.3 && isLike;
    
    if (randomMatch) {
      // Create a match record
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
  }
};
