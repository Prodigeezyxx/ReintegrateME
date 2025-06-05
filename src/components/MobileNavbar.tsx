
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../models/types';
import { Home, Search, Heart, Bell, User, Briefcase, MessageSquare, Users } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const MobileNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role as UserRole;
  
  if (!userRole) return null;
  
  const getHirerNavItems = (): NavItem[] => [
    {
      label: 'Home',
      path: '/hirer-dashboard',
      icon: <Home className="h-5 w-5" />
    },
    {
      label: 'Jobs',
      path: '/hirer-jobs',
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      label: 'Applicants',
      path: '/hirer-applicants',
      icon: <Users className="h-5 w-5" />
    },
    {
      label: 'Discover',
      path: '/hirer-discover',
      icon: <Search className="h-5 w-5" />
    },
    {
      label: 'Messages',
      path: '/hirer-messages',
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];
  
  const getSeekerNavItems = (): NavItem[] => [
    {
      label: 'Home',
      path: '/seeker-dashboard',
      icon: <Home className="h-5 w-5" />
    },
    {
      label: 'Discover',
      path: '/seeker-discover',
      icon: <Search className="h-5 w-5" />
    },
    {
      label: 'Saved',
      path: '/seeker-saved',
      icon: <Heart className="h-5 w-5" />
    },
    {
      label: 'Applications',
      path: '/seeker-applications',
      icon: <Bell className="h-5 w-5" />
    },
    {
      label: 'Profile',
      path: '/seeker-profile',
      icon: <User className="h-5 w-5" />
    }
  ];
  
  const navItems = userRole === 'hirer' ? getHirerNavItems() : getSeekerNavItems();
  
  // Don't show navbar on certain pages
  if (location.pathname.includes('/hirer-messages/') || 
      location.pathname.includes('/seeker-messages/') || 
      location.pathname === '/splash' || 
      location.pathname === '/' || 
      location.pathname === '/role-selection' || 
      location.pathname === '/auth') {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full px-1 py-2 rounded-lg transition-all duration-200
              ${isActive 
                ? 'text-reme-orange bg-orange-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs font-medium truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
