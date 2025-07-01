
import { User, SeekerProfile, CompanyProfile, JobPosting, MatchRecord } from '../models/types';
import type { MockDatabase } from './types';

// Simulated current user
let currentUser: User | null = null;

// Mock database
export const mockDatabase: MockDatabase = {
  users: [],
  seekerProfiles: [],
  companyProfiles: [],
  jobPostings: [],
  matches: []
};

export const getCurrentUser = (): User | null => {
  console.log('Getting current user from memory:', currentUser?.email || 'No user');
  return currentUser;
};

export const setCurrentUser = (user: User | null): void => {
  console.log('Setting current user in memory:', user?.email || 'No user');
  currentUser = user;
};

export const getDatabase = () => mockDatabase;
