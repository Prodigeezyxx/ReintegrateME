
import { profileSetupManager } from './profileSetupManager';

export const calculateProfileCompletion = (): number => {
  const data = profileSetupManager.getAllData();
  let completedFields = 0;
  let totalFields = 10; // Total fields to track

  // Basic info (4 fields - 40% weight)
  if (data.firstName) completedFields += 1;
  if (data.lastName) completedFields += 1;
  if (data.jobTitle) completedFields += 1;
  if (data.headline) completedFields += 1;

  // Skills (1 field - 10% weight)
  if (data.keySkills && data.keySkills.length > 0) completedFields += 1;

  // Work preferences (1 field - 10% weight)
  if (data.workPreferences && data.workPreferences.length > 0) completedFields += 1;

  // Disclosure completion (2 fields - 20% weight)
  if (data.sentenceCompleted !== undefined) completedFields += 1;
  if (data.hasDisability !== undefined) completedFields += 1;

  // Additional profile fields (2 fields - 20% weight)
  if (data.hasDrivingLicence !== undefined) completedFields += 1;
  if (data.openToRelocation !== undefined) completedFields += 1;

  const percentage = Math.round((completedFields / totalFields) * 100);
  return Math.min(percentage, 100);
};
