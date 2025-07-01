
import { JobPosting } from '../../models/types';
import { generateId } from '../types';
import { getCurrentUser, getDatabase } from '../database';

export const createJob = async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
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
    subjectToDbsBarring: jobData.subjectToDbsBarring || false,
    createdAt: new Date(),
    status: jobData.status as 'active' | 'draft' | 'archived' | undefined,
  };
  
  jobPostings.push(newJob);
  
  return newJob;
};
