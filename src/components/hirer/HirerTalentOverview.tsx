import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SkipForward } from 'lucide-react';
import { jobAPI, companyAPI } from '../../services/api';
import { getLogoUrl } from '../../utils/logoUpload';
import { SwipeableCardData } from '../../models/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import QuickStatsCards from './QuickStatsCards';
import TalentDiscoverySection from './TalentDiscoverySection';
import GettingStartedTips from './GettingStartedTips';

const HirerTalentOverview = () => {
  const [companyName, setCompanyName] = useState('Your Company');
  const [talentPreviews, setTalentPreviews] = useState<SwipeableCardData[]>([]);
  const [isTalentLoading, setIsTalentLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    newMessages: 0,
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      fetchCompanyName();
      fetchTalentPreviews();
      fetchQuickStats();
    };
    
    checkAuth();
  }, [navigate]);

  const fetchCompanyName = async () => {
    try {
      const profile = await companyAPI.getProfile();
      if (profile && profile.companyName) {
        setCompanyName(profile.companyName);
      }
    } catch (error) {
      console.error('Failed to fetch company name:', error);
    }
  };

  const fetchTalentPreviews = async () => {
    try {
      setIsTalentLoading(true);
      const talents = await jobAPI.getSeekersFeed();
      setTalentPreviews(talents.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch talent previews:', error);
      toast({
        title: "Error",
        description: "Failed to load talent previews",
        variant: "destructive"
      });
    } finally {
      setIsTalentLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const jobs = await jobAPI.getHirerJobs();
      setStats({
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: Math.floor(Math.random() * 25) + 5, // Simulated applications
        newMessages: Math.floor(Math.random() * 8) + 1, // Simulated new messages
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default stats on error
      setStats({
        activeJobs: 0,
        totalApplications: 0,
        newMessages: 0,
      });
    }
  };
  
  const handleTalentPreviewClick = (talent: SwipeableCardData) => {
    navigate('/hirer-discover');
  };
  
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mobile-container mx-auto beautiful-shadow">
        <div className="p-6">
          {/* Header with workspace branding */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="workspace-button">
                <img 
                  src={getLogoUrl()} 
                  alt="ReintegrateMe"
                  className="h-4 w-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-slate-800 font-semibold">ReintegrateMe</span>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 font-geist mb-2">
              Welcome to ReintegrateMe, {companyName}!
            </h1>
            <p className="text-slate-600 text-lg">
              Discover talented individuals ready to contribute to your team
            </p>
          </div>

          {/* Quick Stats Cards */}
          <QuickStatsCards stats={stats} />

          {/* Talent Discovery Section */}
          <TalentDiscoverySection
            talentPreviews={talentPreviews}
            isTalentLoading={isTalentLoading}
            onTalentPreviewClick={handleTalentPreviewClick}
          />

          {/* Getting Started Tips */}
          <GettingStartedTips />

          {/* Skip Option */}
          <div>
            <Button 
              variant="ghost"
              className="w-full text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-geist font-medium py-4"
              asChild
            >
              <Link to="/hirer-dashboard" className="flex items-center justify-center gap-2">
                <SkipForward className="h-4 w-4" />
                Skip for Now - Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HirerTalentOverview;
