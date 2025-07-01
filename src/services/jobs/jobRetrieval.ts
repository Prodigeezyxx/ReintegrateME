
import { JobPosting } from '../../models/types';
import { getCurrentUser, getDatabase } from '../database';

export const getHirerJobs = async (): Promise<JobPosting[]> => {
  const currentUser = getCurrentUser();
  const { jobPostings } = getDatabase();
  
  if (!currentUser || currentUser.role !== 'hirer') {
    throw new Error('Only hirers can access their job postings');
  }
  
  return jobPostings.filter(job => job.hirerId === currentUser?.id);
};
