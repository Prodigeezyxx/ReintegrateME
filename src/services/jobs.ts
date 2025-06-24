
import { JobPosting, SwipeableCardData } from '../models/types';
import { generateId } from './types';
import { getCurrentUser, getDatabase } from './database';

export const jobAPI = {
  createJob: async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
    const currentUser = getCurrentUser();
    const { companyProfiles, jobPostings } = getDatabase();
    
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
    const currentUser = getCurrentUser();
    const { jobPostings } = getDatabase();
    
    if (!currentUser || currentUser.role !== 'hirer') {
      throw new Error('Only hirers can access their job postings');
    }
    
    return jobPostings.filter(job => job.hirerId === currentUser?.id);
  },
  
  getJobsFeed: async (): Promise<SwipeableCardData[]> => {
    const currentUser = getCurrentUser();
    const { seekerProfiles, jobPostings } = getDatabase();
    
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
    const currentUser = getCurrentUser();
    const { seekerProfiles } = getDatabase();
    
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
