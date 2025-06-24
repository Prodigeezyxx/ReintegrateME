
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

export const getCurrentUser = (): User | null => currentUser;
export const setCurrentUser = (user: User | null): void => {
  currentUser = user;
};

export const getDatabase = () => mockDatabase;
