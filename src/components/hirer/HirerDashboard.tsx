import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Briefcase, Users, MessageSquare, Activity, Plus, RefreshCw, Zap } from 'lucide-react';
import { authAPI, jobAPI } from '../../services/api';

const HirerDashboard = () => {
  const [stats, setStats] = useState({
    activeOpenings: 0,
    totalApplicants: 0,
    newApplicants: 0,
    unreadMessages: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      // In a real app, we would fetch the dashboard data from an API
      // For now, we'll simulate it with mock data
      
      // Get user's jobs to calculate stats
      const jobs = await jobAPI.getHirerJobs();
      
      // Calculate mock statistics
      const activeOpenings = jobs.filter(job => job.status !== 'archived').length;
      const totalApplicants = Math.floor(Math.random() * 50) + 10;
      const newApplicants = Math.floor(Math.random() * 10);
      const unreadMessages = Math.floor(Math.random() * 15);
      
      setStats({
        activeOpenings,
        totalApplicants,
        newApplicants,
        unreadMessages
      });
      
      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'application', title: 'New application for Construction Worker', time: '2 hours ago' },
        { id: 2, type: 'message', title: 'Sarah Johnson sent you a message', time: '5 hours ago' },
        { id: 3, type: 'match', title: 'New match with Robert Chen', time: '1 day ago' },
        { id: 4, type: 'view', title: 'Your Electrician job post was viewed 24 times', time: '2 days ago' },
      ]);
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    fetchDashboardData();
  };
  
  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case 'application':
        navigate('/hirer-applicants');
        break;
      case 'message':
        navigate('/hirer-messages');
        break;
      case 'match':
        navigate('/hirer-discover');
        break;
      case 'view':
        navigate('/hirer-jobs');
        break;
      default:
        break;
    }
  };
  
  const handleStatsClick = (statType) => {
    switch (statType) {
      case 'activeJobs':
        navigate('/hirer-jobs');
        break;
      case 'totalApplicants':
        navigate('/hirer-applicants');
        break;
      case 'newApplicants':
        navigate('/hirer-applicants?filter=new');
        break;
      case 'unreadMessages':
        navigate('/hirer-messages');
        break;
      default:
        break;
    }
  };
  
  const renderActivityIcon = (type) => {
    switch (type) {
      case 'application':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'match':
        return <Users className="h-4 w-4 text-reme-orange" />;
      case 'view':
        return <Activity className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-container mx-auto p-6 flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-geist">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="mobile-container mx-auto beautiful-shadow">
        <div className="p-6">
          {/* Header with workspace branding */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="workspace-button">
                <Zap className="h-4 w-4 text-indigo-600" />
                <span className="text-slate-800 font-semibold">ReintegrateMe</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="beautiful-shadow-subtle hover:beautiful-shadow rounded-xl"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 font-geist">Dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</p>
          </div>
          
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="beautiful-shadow hover:beautiful-shadow-subtle transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-indigo-50" onClick={() => handleStatsClick('activeJobs')}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-blue-500 p-2 rounded-xl mb-2">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-800 font-geist">{stats.activeOpenings}</p>
                <p className="text-xs text-slate-600 font-medium">Active Jobs</p>
              </CardContent>
            </Card>
            
            <Card className="beautiful-shadow hover:beautiful-shadow-subtle transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-emerald-50 to-green-50" onClick={() => handleStatsClick('totalApplicants')}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-emerald-500 p-2 rounded-xl mb-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-800 font-geist">{stats.totalApplicants}</p>
                <p className="text-xs text-slate-600 font-medium">Total Applicants</p>
              </CardContent>
            </Card>
            
            <Card className="beautiful-shadow hover:beautiful-shadow-subtle transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-amber-50 to-orange-50" onClick={() => handleStatsClick('newApplicants')}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-amber-500 p-2 rounded-xl mb-2 relative">
                  <Users className="h-5 w-5 text-white" />
                  {stats.newApplicants > 0 && (
                    <div className="absolute -top-1 -right-1 notification-dot"></div>
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-800 font-geist">{stats.newApplicants}</p>
                <p className="text-xs text-slate-600 font-medium">New Applicants</p>
              </CardContent>
            </Card>
            
            <Card className="beautiful-shadow hover:beautiful-shadow-subtle transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-pink-50" onClick={() => handleStatsClick('unreadMessages')}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-purple-500 p-2 rounded-xl mb-2 relative">
                  <MessageSquare className="h-5 w-5 text-white" />
                  {stats.unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 notification-dot"></div>
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-800 font-geist">{stats.unreadMessages}</p>
                <p className="text-xs text-slate-600 font-medium">Unread Messages</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Quick Actions */}
          <Card className="mb-6 beautiful-shadow border-0">
            <CardHeader className="px-4 pt-4 pb-1">
              <CardTitle className="text-lg font-geist text-slate-800">Quick Actions</CardTitle>
              <CardDescription className="text-slate-500">Get things done faster</CardDescription>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start beautiful-shadow-subtle hover:beautiful-shadow border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-200"
                asChild
              >
                <Link to="/hirer-jobs">
                  <Briefcase className="h-4 w-4 mr-2 text-slate-600" />
                  <span className="font-medium text-slate-700">Manage Jobs</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="justify-start beautiful-shadow-subtle hover:beautiful-shadow border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200"
                asChild
              >
                <Link to="/hirer-create-job">
                  <Plus className="h-4 w-4 mr-2 text-indigo-600" />
                  <span className="font-medium text-indigo-700">Post New Job</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Enhanced Recent Activity */}
          <Card className="mb-6 flex-1 beautiful-shadow border-0">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-lg font-geist text-slate-800">Recent Activity</CardTitle>
              <CardDescription className="text-slate-500">Latest updates and events</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-0">
              {recentActivities.length > 0 ? (
                <div className="space-y-1">
                  {recentActivities.map(activity => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-lg px-2 transition-all duration-200"
                      onClick={() => handleActivityClick(activity)}
                    >
                      <div className="bg-slate-100 rounded-xl p-2 mt-1 beautiful-shadow-subtle">
                        {renderActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 font-geist">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-slate-500 font-geist">No recent activity</p>
              )}
            </CardContent>
          </Card>
          
          {/* Enhanced Talent Discovery */}
          <div className="mb-6">
            <Card className="beautiful-shadow border-0 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-lg font-geist text-slate-800">Talent Discovery</CardTitle>
                <CardDescription className="text-slate-600">Find the perfect candidates for your jobs</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white beautiful-shadow transition-all duration-200 font-geist font-medium"
                  asChild
                >
                  <Link to="/hirer-discover">
                    Browse Talent
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HirerDashboard;
