
import { MatchRecord } from '../models/types';
import { generateId, SwipeResult } from './types';
import { getCurrentUser, getDatabase } from './database';

export const swipeAPI = {
  processSwipe: async (swipedEntityId: string, swipedEntityType: 'seeker' | 'job', swipeType: 'like' | 'pass' | 'super_like', contextJobId?: string): Promise<SwipeResult> => {
    const currentUser = getCurrentUser();
    const { jobPostings, seekerProfiles, companyProfiles, matches } = getDatabase();
    
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
    const currentUser = getCurrentUser();
    const { matches } = getDatabase();
    
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
