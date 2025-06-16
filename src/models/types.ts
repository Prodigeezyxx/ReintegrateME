
export type UserRole = 'hirer' | 'seeker';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profileId?: string;
  createdAt: Date;
}

export interface SeekerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  profilePictureUrl?: string;
  headline?: string;
  bio?: string;
  keySkills?: string[];
  locationCity?: string;
  locationCountry?: string;
  preferredJobCategories?: string[];
  preferredEmploymentTypes?: string[];
  availabilityStatus?: 'actively_looking' | 'open_to_opportunities' | 'not_looking';
  profileCompletionPercentage?: number;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  logoUrl?: string;
  industry?: string;
  companySize?: string;
  websiteUrl?: string;
  description?: string;
  locationCity?: string;
  locationCountry?: string;
  profileCompletionPercentage?: number;
}

export interface JobPosting {
  id: string;
  hirerId: string;
  companyId: string;
  title: string;
  description: string;
  companyName: string;
  companyLogoUrl?: string;
  category: string;
  employmentType: string;
  experienceLevel?: string;
  locationCity?: string;
  locationCountry?: string;
  requiredSkills?: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  status?: 'active' | 'draft' | 'archived';
  createdAt: Date;
}

export interface SwipeableCardData {
  id: string;
  type: 'seeker' | 'job';
  primaryImageUrl?: string;
  titleText: string;
  subtitleText?: string;
  detailLine1?: string;
  detailLine2?: string;
  tags?: string[];
}

export interface MatchRecord {
  id: string;
  hirerId: string;
  seekerId: string;
  hirerCompanyName: string;
  seekerDisplayName: string;
  contextJobId?: string;
  contextJobTitle?: string;
  matchTimestamp: Date;
  chatThreadId?: string;
}
