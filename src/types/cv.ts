export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface ProfessionalSummary {
  content: string;
}

export interface Skill {
  name: string;
  category: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary;
  skills: Skill[];
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  template: string;
  targetJob?: string;
  jobDescription?: string;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  isATSOptimized: boolean;
}