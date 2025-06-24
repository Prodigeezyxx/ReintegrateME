
import { getAllSkills } from '../data/skillsDatabase';

// Re-export all APIs
export { authAPI } from './auth';
export { companyAPI } from './company';
export { seekerAPI } from './seeker';
export { jobAPI } from './jobs';
export { swipeAPI } from './swipe';
export { imageStorageAPI } from './storage';

// Re-export constants
export { jobCategories, employmentTypes, countries } from './constants';

// Export skills from the comprehensive database
export const skills = getAllSkills().map(skill => skill.name);
