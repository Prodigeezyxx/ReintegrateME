
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Briefcase, MessageSquare, User, Bot, Heart } from 'lucide-react';

const SeekerHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Discover Jobs',
      description: 'Swipe through job opportunities',
      icon: <Search className="h-8 w-8" />,
      path: '/seeker-discover',
      color: 'bg-blue-500'
    },
    {
      title: 'My Applications',
      description: 'Track your job applications',
      icon: <Briefcase className="h-8 w-8" />,
      path: '/seeker-applications',
      color: 'bg-green-500'
    },
    {
      title: 'Messages',
      description: 'Chat with employers',
      icon: <MessageSquare className="h-8 w-8" />,
      path: '/seeker-messages',
      color: 'bg-purple-500'
    },
    {
      title: 'AI Assistant',
      description: 'Get help with your job search',
      icon: <Bot className="h-8 w-8" />,
      path: '/seeker-ai-chat',
      color: 'bg-orange-500'
    },
    {
      title: 'My Profile',
      description: 'Update your profile',
      icon: <User className="h-8 w-8" />,
      path: '/seeker-profile',
      color: 'bg-indigo-500'
    },
    {
      title: 'Saved Jobs',
      description: 'View your liked jobs',
      icon: <Heart className="h-8 w-8" />,
      path: '/seeker-saved',
      color: 'bg-red-500'
    }
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const handleStatClick = (statType: string) => {
    // Navigate based on stat type
    switch (statType) {
      case 'jobs':
        navigate('/seeker-discover');
        break;
      case 'applications':
        navigate('/seeker-applications');
        break;
      case 'messages':
        navigate('/seeker-messages');
        break;
      default:
        break;
    }
  };

  return (
    <div className="mobile-container p-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Job Seeker!
        </h1>
        <p className="text-gray-600">Ready to find your next opportunity?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleMenuItemClick(item.path)}
            className="ios-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
              <div className="text-white">{item.icon}</div>
            </div>
            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 ios-card p-4">
        <h3 className="font-semibold mb-2">Quick Stats</h3>
        <div className="flex justify-between text-sm">
          <div 
            className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleStatClick('jobs')}
          >
            <div className="font-bold text-lg text-blue-500">24</div>
            <div className="text-gray-500">Jobs Viewed</div>
          </div>
          <div 
            className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleStatClick('applications')}
          >
            <div className="font-bold text-lg text-green-500">3</div>
            <div className="text-gray-500">Applications</div>
          </div>
          <div 
            className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleStatClick('messages')}
          >
            <div className="font-bold text-lg text-purple-500">1</div>
            <div className="text-gray-500">Messages</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerHome;
