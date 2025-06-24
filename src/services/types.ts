
import { User, UserRole, SeekerProfile, CompanyProfile, JobPosting, SwipeableCardData, MatchRecord } from '../models/types';

// Internal service types
export interface MockDatabase {
  users: User[];
  seekerProfiles: SeekerProfile[];
  companyProfiles: CompanyProfile[];
  jobPostings: JobPosting[];
  matches: MatchRecord[];
}

export interface SwipeResult {
  isMatch: boolean;
  match?: MatchRecord;
}

// Generate a random ID
export const generateId = () => Math.random().toString(36).substring(2, 15);
