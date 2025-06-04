import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Briefcase, Users, MessageSquare, Activity, Plus, RefreshCw } from 'lucide-react';
import { authAPI, jobAPI } from '../../services/api';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      
      // Get user's jobs to calculate stats
      const jobs = await jobAPI.getHirerJobs();
      
      // Calculate real statistics for guest users with mock applicants
      const activeOpenings = jobs.filter(job => job.status !== 'archived').length;
      
      // For guest users, calculate based on the mock applicants we have
      let totalApplicants = 0;
      let newApplicants = 0;
      
      if (user?.isGuest) {
        // Mock applicants data from HirerApplicants component
        totalApplicants = 10; // Total number of mock applicants
        newApplicants = 6; // Applicants with "new" status
      } else {
        // For real users, you would fetch actual applicant data from your backend
        totalApplicants = Math.floor(Math.random() * 50) + 10;
        newApplicants = Math.floor(Math.random() * 10);
      }
      
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
      <div className="mobile-container p-6 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mobile-container p-6 pb-24">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {user?.isGuest && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              👀 <strong>Guest Mode:</strong> These are sample stats to show you how the platform works
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="hover-scale">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Briefcase className="h-6 w-6 text-reme-orange mb-2" />
              <p className="text-2xl font-bold">{stats.activeOpenings}</p>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{stats.totalApplicants}</p>
              <p className="text-xs text-muted-foreground">Total Applicants</p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-2xl font-bold">{stats.newApplicants}</p>
              <p className="text-xs text-muted-foreground">New Applicants</p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{stats.unreadMessages}</p>
              <p className="text-xs text-muted-foreground">Unread Messages</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="justify-start"
              asChild
            >
              <Link to="/hirer-applicants">
                <Users className="h-4 w-4 mr-2" />
                View Applicants
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              asChild
            >
              <Link to="/hirer-create-job">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="mb-6 flex-1">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest updates and events</CardDescription>
          </CardHeader>
          <CardContent className="px-4 py-0">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="bg-gray-100 rounded-full p-2 mt-1">
                      {renderActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">No recent activity</p>
            )}
          </CardContent>
        </Card>
        
        <div className="mb-6">
          <Card>
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-lg">Talent Discovery</CardTitle>
              <CardDescription>Find candidates for your jobs</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                className="w-full bg-reme-orange hover:bg-orange-600 transition-colors"
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
  );
};

export default HirerDashboard;
