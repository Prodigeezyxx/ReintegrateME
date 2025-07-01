
import { createJob } from './jobCreation';
import { getHirerJobs } from './jobRetrieval';
import { getJobsFeed, getSeekersFeed } from './feedGeneration';

export const jobAPI = {
  createJob,
  getHirerJobs,
  getJobsFeed,
  getSeekersFeed
};
