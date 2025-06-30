import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, TrendingUp, ArrowRight, SkipForward } from 'lucide-react';
import { jobAPI, companyAPI } from '../../services/api';
import { getLogoUrl } from '../../utils/logoUpload';
import { SwipeableCardData } from '../../models/types';
import TalentPreviewCard from './TalentPreviewCard';

const HirerTalentOverview = () => {
  const [companyName, setCompanyName] = useState('Your Company');
  const [talentPreviews, setTalentPreviews] = useState<SwipeableCardData[]>([]);
  const [isTalentLoading, setIsTalentLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    profileViews: 0,
    responseRate: 0,
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCompanyName();
    fetchTalentPreviews();
    fetchQuickStats();
  }, []);

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
    } finally {
      setIsTalentLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const jobs = await jobAPI.getHirerJobs();
      setStats({
        activeJobs: jobs.filter(job => job.status !== 'archived').length,
        profileViews: Math.floor(Math.random() * 150) + 50,
        responseRate: Math.floor(Math.random() * 40) + 60,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
          <div className="grid grid-cols-3 gap-3 mb-8">
            <Card className="beautiful-shadow-subtle border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-4 text-center">
                <div className="bg-blue-500 p-2 rounded-xl mb-2 w-fit mx-auto">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <p className="text-xl font-bold text-slate-800 font-geist">{stats.activeJobs}</p>
                <p className="text-xs text-slate-600">Active Jobs</p>
              </CardContent>
            </Card>
            
            <Card className="beautiful-shadow-subtle border-0 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardContent className="p-4 text-center">
                <div className="bg-emerald-500 p-2 rounded-xl mb-2 w-fit mx-auto">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <p className="text-xl font-bold text-slate-800 font-geist">{stats.profileViews}</p>
                <p className="text-xs text-slate-600">Profile Views</p>
              </CardContent>
            </Card>
            
            <Card className="beautiful-shadow-subtle border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4 text-center">
                <div className="bg-purple-500 p-2 rounded-xl mb-2 w-fit mx-auto">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <p className="text-xl font-bold text-slate-800 font-geist">{stats.responseRate}%</p>
                <p className="text-xs text-slate-600">Response Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Talent Discovery Section */}
          <Card className="mb-6 beautiful-shadow border-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            <CardHeader className="px-4 pt-6 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-geist text-slate-800 mb-1">Discover Top Talent</CardTitle>
                  <CardDescription className="text-slate-600">Find the perfect candidates for your roles</CardDescription>
                </div>
                <div className="bg-orange-100 p-2 rounded-xl">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              {isTalentLoading ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[200px] h-32 bg-slate-200 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : talentPreviews.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {talentPreviews.map((talent) => (
                    <TalentPreviewCard
                      key={talent.id}
                      talent={talent}
                      onClick={() => handleTalentPreviewClick(talent)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-600 mb-4 font-geist">No talent profiles available at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prominent Browse Talent Button - Moved Up */}
          <div className="mb-8">
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white beautiful-shadow transition-all duration-200 font-geist font-bold text-xl py-8 h-auto"
              asChild
            >
              <Link to="/hirer-discover" className="flex items-center justify-center gap-3">
                <Users className="h-6 w-6" />
                Browse All Talent
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>

          {/* Getting Started Tips */}
          <Card className="mb-8 beautiful-shadow border-0">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-lg font-geist text-slate-800">Getting Started Tips</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1.5 rounded-lg mt-0.5">
                    <Briefcase className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Post your first job</p>
                    <p className="text-xs text-slate-600">Create detailed job postings to attract the right candidates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1.5 rounded-lg mt-0.5">
                    <Users className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Browse talent profiles</p>
                    <p className="text-xs text-slate-600">Use our swipe feature to discover candidates that match your needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-1.5 rounded-lg mt-0.5">
                    <TrendingUp className="h-3 w-3 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Optimize your company profile</p>
                    <p className="text-xs text-slate-600">Complete your profile to attract more quality applications</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
