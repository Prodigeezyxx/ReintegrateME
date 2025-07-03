import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authAPI } from '../../services/api';
import { seekerAPI } from '../../services/seeker';
import { Bot, Search, FileText, Bell, User, Heart, MessageSquare, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import AnimatedCard from '../ui/animated-card';
import AnimatedProgress from '../ui/animated-progress';

const SeekerDashboard2 = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(authAPI.getCurrentUser());
  const [favorites, setFavorites] = useState([]);
  const [profileData, setProfileData] = useState(null);
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('seekerFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }

    // Load profile data to get profile image
    const loadProfile = async () => {
      try {
        const profile = await seekerAPI.getProfile();
        setProfileData(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const quickActions = [
    {
      title: 'AI Suite',
      description: 'AI Coach, CV Builder & Chat',
      icon: <Bot className="h-6 w-6" />,
      color: 'bg-purple-500',
      path: '/seeker-ai-suite',
      badge: 'Powered by AI'
    },
    {
      title: 'Applications',
      description: 'Track your job applications',
      icon: <Bell className="h-6 w-6" />,
      color: 'bg-green-500',
      path: '/seeker-applications',
      badge: '3 pending'
    },
    {
      title: 'Profile',
      description: 'Manage your profile',
      icon: <User className="h-6 w-6" />,
      color: 'bg-orange-500',
      path: '/seeker-profile',
      badge: '85% complete'
    }
  ];

  const stats = [
    { label: 'Applications', value: '12', icon: <Briefcase className="h-4 w-4" />, path: '/seeker-applications' },
    { label: 'Saved Jobs', value: favorites.length.toString(), icon: <Heart className="h-4 w-4" />, path: '/seeker-saved' },
    { label: 'Messages', value: '3', icon: <MessageSquare className="h-4 w-4" />, path: '/seeker-messages' },
    { label: 'AI Suite', value: '', icon: <Bot className="h-4 w-4" />, path: '/seeker-ai-suite' }
  ];

  // Get display name from user data
  const getDisplayName = () => {
    if (currentUser?.email) {
      // Extract name from email before @ symbol
      const emailName = currentUser.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Job Seeker';
  };

  return (
    <div className="mobile-container safe-top bg-gradient-to-b from-white to-slate-50 min-h-screen">
      <div className="p-6 pb-20">
        {/* Welcome Section */}
        <AnimatedCard className="mb-6" delay={0}>
          <div className="text-center py-6">
            <div className="mb-4">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarImage src={profileData?.profileImageUrl || profileData?.profile_image_url} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-geist mb-2">
              Welcome back, {getDisplayName()}!
            </h1>
            <p className="text-slate-600 font-geist mb-6">
              Ready to find your next opportunity?
            </p>
            
            {/* Primary CTA for Job Discovery */}
            <Button 
              onClick={() => navigate('/seeker-discover')}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-lg"
              size="lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Start Swiping
            </Button>
          </div>
        </AnimatedCard>

        {/* Stats Overview - Now clickable */}
        <AnimatedCard className="mb-6" delay={100}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geist">Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl cursor-pointer hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 transition-all duration-200 active:scale-95"
                  onClick={() => navigate(stat.path)}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 font-geist">{stat.value}</div>
                  <div className="text-xs text-slate-600 font-geist">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Profile Completion - Now clickable */}
        <AnimatedCard 
          className="mb-6 cursor-pointer hover:shadow-lg transition-all duration-200" 
          delay={200}
          onClick={() => navigate('/seeker-profile')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geist flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">85% Complete</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/seeker-profile');
                  }}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Complete Profile
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <AnimatedProgress value={85} />
              <p className="text-xs text-slate-600">
                Complete your profile to get better job matches
              </p>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-geist">Quick Actions</h2>
          
          {quickActions.map((action, index) => (
            <AnimatedCard 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95"
              delay={300 + (index * 100)}
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <div className="text-white">{action.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 font-geist">{action.title}</h3>
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 font-geist">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                </div>
              </CardContent>
            </AnimatedCard>
          ))}
        </div>

        {/* Recent Activity - Now clickable */}
        <AnimatedCard className="mt-6" delay={700}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geist">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div 
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 active:scale-95"
                onClick={() => navigate('/seeker-discover')}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">New job matches available</p>
                  <p className="text-xs text-slate-600">5 new opportunities in your area</p>
                </div>
                <span className="text-xs text-slate-500">2h ago</span>
              </div>
              
              <div 
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all duration-200 active:scale-95"
                onClick={() => navigate('/seeker-applications')}
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Application submitted</p>
                  <p className="text-xs text-slate-600">Software Developer at Tech Corp</p>
                </div>
                <span className="text-xs text-slate-500">1d ago</span>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default SeekerDashboard2;
