import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { UserRole } from '../models/types';
import { LayoutDashboard, Briefcase, MessageSquare, Users, Search, Bot } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const MobileNavbar = () => {
  const location = useLocation();
  const currentUser = authAPI.getCurrentUser();
  const userRole = currentUser?.role as UserRole;
  
  if (!userRole) return null;
  
  const getHirerNavItems = (): NavItem[] => [
    {
      label: 'Dashboard',
      path: '/hirer-dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
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
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      label: 'Discover',
      path: '/seeker-discover',
      icon: <Search className="h-5 w-5" />
    },
    {
      label: 'Applications',
      path: '/seeker-applications',
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      label: 'AI Chat',
      path: '/seeker-ai-chat',
      icon: <Bot className="h-5 w-5" />
    },
    {
      label: 'Messages',
      path: '/seeker-messages',
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];
  
  const navItems = userRole === 'hirer' ? getHirerNavItems() : getSeekerNavItems();
  
  // Only show the most important items in the bottom navbar (limit to 5)
  const bottomNavItems = navItems.slice(0, 5);
  
  // Don't show navbar on chat detail pages
  if (location.pathname.includes('/hirer-messages/') || 
      location.pathname.includes('/seeker-messages/') || 
      location.pathname === '/splash' || 
      location.pathname === '/' || 
      location.pathname === '/role-selection' || 
      location.pathname === '/auth') {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {bottomNavItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full
              ${isActive ? 'text-reme-orange' : 'text-gray-500'}
            `}
          >
            <div>{item.icon}</div>
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
