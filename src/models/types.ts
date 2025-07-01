export type UserRole = 'hirer' | 'seeker';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profileId?: string;
  createdAt: Date;
}

// Legal Information Types
export type LegalSupervisionType = 
  | 'probation' 
  | 'parole' 
  | 'community_sentence' 
  | 'licence' 
  | 'mappa_oversight' 
  | 'none';

export type ConvictionType = 
  | 'theft_burglary_robbery'
  | 'fraud_financial_offences'
  | 'drug_offences_possession'
  | 'drug_offences_supply'
  | 'drug_offences_production'
  | 'driving_offences'
  | 'assault_violent_offences'
  | 'sexual_offences'
  | 'public_order_offences'
  | 'domestic_abuse_related'
  | 'terrorism_related_offences'
  | 'weapons_offences'
  | 'harassment_stalking'
  | 'arson'
  | 'breach_court_orders'
  | 'other';

export type ConvictionStatusType = 'spent' | 'unspent' | 'pending';

export type MappaLevelType = 'level_1' | 'level_2' | 'level_3' | 'not_applicable';

// Disability & Health Types
export type DisabilityType = 
  | 'mobility_physical_access'
  | 'sensory_hearing_vision_processing'
  | 'long_term_medical_condition'
  | 'neurodivergence'
  | 'learning_difficulty'
  | 'mental_health'
  | 'communication_needs'
  | 'cognitive_memory_difficulties'
  | 'other'
  | 'prefer_not_to_specify';

export type WorkplaceAdjustmentType = 
  | 'flexible_working_hours'
  | 'remote_work_option'
  | 'additional_training_support'
  | 'assistive_technology'
  | 'modified_physical_work_environment'
  | 'communication_support'
  | 'none'
  | 'other';

export type WorkPreferenceType = 
  | 'full_time'
  | 'part_time'
  | 'zero_hours'
  | 'weekends'
  | 'nights';

export interface SeekerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  jobTitle?: string;
  profilePictureUrl?: string;
  headline?: string;
  bio?: string;
  keySkills?: string[];
  locationCity?: string;
  locationCountry?: string;
  phone?: string;
  email?: string;
  
  // Legal Information
  sentenceCompleted?: boolean;
  currentLegalSupervision?: LegalSupervisionType;
  convictionTypes?: ConvictionType[];
  convictionStatus?: ConvictionStatusType;
  convictionOtherDetails?: string;
  barredFromRegulatedWork?: boolean;
  onDbsBarringList?: boolean;
  mappaLevel?: MappaLevelType;
  relevantForSafeguardingChecks?: boolean;
  
  // Disability & Health Information
  hasDisability?: boolean;
  disabilityTypes?: DisabilityType[];
  disabilityOtherDetails?: string;
  workplaceAdjustments?: WorkplaceAdjustmentType[];
  workplaceAdjustmentsOther?: string;
  
  // Employment Preferences
  hasDrivingLicence?: boolean;
  workPreferences?: WorkPreferenceType[];
  openToRelocation?: boolean;
  
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
