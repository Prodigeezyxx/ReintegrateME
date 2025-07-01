
import { JobPosting, SwipeableCardData } from '../../models/types';
import { supabase } from '@/integrations/supabase/client';

export const getJobsFeed = async (): Promise<SwipeableCardData[]> => {
  const { data: jobs, error } = await supabase
    .from('job_postings')
    .select(`
      *,
      company_profiles!inner(
        company_name,
        logo_url
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Failed to fetch jobs feed:', error);
    return [];
  }
  
  return jobs.map(job => ({
    id: job.id,
    type: 'job' as const,
    primaryImageUrl: job.company_profiles.logo_url,
    titleText: job.title,
    subtitleText: job.company_profiles.company_name,
    detailLine1: `${job.location_city || ''}, ${job.location_country || ''}`.replace(/^, |, $/, ''),
    detailLine2: job.employment_type,
    tags: job.required_skills?.slice(0, 3) || [],
  }));
};

export const getSeekersFeed = async (): Promise<SwipeableCardData[]> => {
  const { data: seekers, error } = await supabase
    .from('seeker_profiles')
    .select('*')
    .not('first_name', 'is', null)
    .not('last_name', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Failed to fetch seekers feed:', error);
    return [];
  }
  
  return seekers.map(seeker => ({
    id: seeker.id,
    type: 'seeker' as const,
    primaryImageUrl: seeker.profile_image_url,
    titleText: `${seeker.first_name} ${seeker.last_name}`,
    subtitleText: seeker.job_title || seeker.headline || '',
    detailLine1: `${seeker.location_city || ''}, ${seeker.location_country || ''}`.replace(/^, |, $/, ''),
    detailLine2: seeker.availability_status,
    tags: seeker.key_skills?.slice(0, 3) || [],
  }));
};
