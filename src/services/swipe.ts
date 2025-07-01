
import { MatchRecord } from '../models/types';
import { SwipeResult } from './types';
import { supabase } from '@/integrations/supabase/client';

export const swipeAPI = {
  processSwipe: async (swipedEntityId: string, swipedEntityType: 'seeker' | 'job', swipeType: 'like' | 'pass' | 'super_like', contextJobId?: string): Promise<SwipeResult> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to swipe');
    }
    
    const isLike = swipeType === 'like' || swipeType === 'super_like';
    
    // Record the swipe
    const { error: swipeError } = await supabase
      .from('swipe_records')
      .insert([{
        swiper_id: user.id,
        swiped_entity_id: swipedEntityId,
        swiped_entity_type: swipedEntityType,
        swipe_type: swipeType,
        context_job_id: contextJobId,
      }]);
    
    if (swipeError) {
      console.error('Failed to record swipe:', swipeError);
    }
    
    // Simple match probability logic
    let matchProbability = 0.3;
    
    if (user.user_metadata?.role === 'seeker' && swipedEntityType === 'job') {
      // Get job details and seeker profile for skill matching
      const { data: job } = await supabase
        .from('job_postings')
        .select('required_skills')
        .eq('id', swipedEntityId)
        .single();
      
      const { data: seekerProfile } = await supabase
        .from('seeker_profiles')
        .select('key_skills')
        .eq('user_id', user.id)
        .single();
      
      if (job && seekerProfile) {
        const jobSkills = job.required_skills || [];
        const seekerSkills = seekerProfile.key_skills || [];
        const matchingSkills = jobSkills.filter((skill: string) => seekerSkills.includes(skill));
        
        if (jobSkills.length > 0) {
          const skillMatchRatio = matchingSkills.length / jobSkills.length;
          matchProbability = 0.2 + (skillMatchRatio * 0.6);
        }
      }
    }
    
    const randomMatch = Math.random() < matchProbability && isLike;
    
    if (randomMatch) {
      let matchData: any;
      
      if (user.user_metadata?.role === 'hirer' && swipedEntityType === 'seeker') {
        const { data: seeker } = await supabase
          .from('seeker_profiles')
          .select('user_id, first_name, last_name')
          .eq('id', swipedEntityId)
          .single();
        
        if (!seeker) {
          throw new Error('Seeker not found');
        }
        
        const { data: company } = await supabase
          .from('company_profiles')
          .select('company_name')
          .eq('user_id', user.id)
          .single();
        
        if (!company) {
          throw new Error('Company profile not found');
        }
        
        matchData = {
          hirer_id: user.id,
          seeker_id: seeker.user_id,
          context_job_id: contextJobId,
        };
        
      } else if (user.user_metadata?.role === 'seeker' && swipedEntityType === 'job') {
        const { data: job } = await supabase
          .from('job_postings')
          .select('hirer_id, title')
          .eq('id', swipedEntityId)
          .single();
        
        if (!job) {
          throw new Error('Job not found');
        }
        
        matchData = {
          hirer_id: job.hirer_id,
          seeker_id: user.id,
          context_job_id: swipedEntityId,
        };
        
      } else {
        throw new Error('Invalid swipe combination');
      }
      
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert([matchData])
        .select()
        .single();
      
      if (matchError) {
        console.error('Failed to create match:', matchError);
        return { isMatch: false };
      }
      
      // Transform to MatchRecord format
      const matchRecord: MatchRecord = {
        id: match.id,
        hirerId: match.hirer_id,
        seekerId: match.seeker_id,
        hirerCompanyName: '', // Would need additional query to get this
        seekerDisplayName: '', // Would need additional query to get this
        contextJobId: match.context_job_id,
        contextJobTitle: undefined, // Would need additional query to get this
        matchTimestamp: new Date(match.created_at),
        chatThreadId: match.chat_thread_id,
      };
      
      return { isMatch: true, match: matchRecord };
    }
    
    return { isMatch: false };
  },
  
  getMatches: async (): Promise<MatchRecord[]> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to get matches');
    }
    
    let query = supabase.from('matches').select('*');
    
    if (user.user_metadata?.role === 'hirer') {
      query = query.eq('hirer_id', user.id);
    } else {
      query = query.eq('seeker_id', user.id);
    }
    
    const { data: matches, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch matches: ${error.message}`);
    }
    
    return matches.map(match => ({
      id: match.id,
      hirerId: match.hirer_id,
      seekerId: match.seeker_id,
      hirerCompanyName: '', // Would need join to get this
      seekerDisplayName: '', // Would need join to get this
      contextJobId: match.context_job_id,
      contextJobTitle: undefined, // Would need join to get this
      matchTimestamp: new Date(match.created_at),
      chatThreadId: match.chat_thread_id,
    }));
  }
};
