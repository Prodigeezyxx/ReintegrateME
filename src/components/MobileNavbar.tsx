
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { UserRole } from '../models/types';
import { Home, Search, Heart, Bell, User, Briefcase, MessageSquare, Users, Bot } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  isCenter?: boolean;
}

const MobileNavbar = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(authAPI.getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Add a small delay to ensure auth state is settled
    const timer = setTimeout(() => {
      const user = authAPI.getCurrentUser();
      setCurrentUser(user);
      setIsLoading(false);
      console.log('MobileNavbar: Auth check complete, user:', user?.email || 'No user');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  const userRole = currentUser?.role as UserRole;
  
  // Don't show navbar while loading or for hirers
  if (isLoading || !userRole || userRole === 'hirer') return null;
  
  const getSeekerNavItems = (): NavItem[] => [
    {
      label: 'Discover',
      path: '/seeker-dashboard',
      icon: <Home className="h-5 w-5" />
    },
    {
      label: 'Home',
      path: '/seeker-discover',
      icon: <Search className="h-5 w-5" />
    },
    {
      label: 'AI Suite',
      path: '/seeker-ai-suite',
      icon: <Bot className="h-6 w-6" />,
      isCenter: true
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
  
  const navItems = getSeekerNavItems();
  
  // Don't show navbar on certain pages
  if (location.pathname.includes('/seeker-messages/') || 
      location.pathname === '/splash' || 
      location.pathname === '/' || 
      location.pathname === '/role-selection' || 
      location.pathname === '/auth') {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-10 beautiful-shadow">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full px-1 py-2 rounded-xl transition-all duration-200 font-geist
              ${item.isCenter ? 'transform -translate-y-2 mx-2' : ''}
              ${isActive 
                ? item.isCenter 
                  ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-500 beautiful-shadow scale-105' 
                  : 'text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 beautiful-shadow-subtle'
                : item.isCenter 
                  ? 'text-white bg-gradient-to-r from-slate-400 to-slate-500 hover:from-indigo-400 hover:to-purple-400 beautiful-shadow-subtle hover:beautiful-shadow' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            <div className={`${item.isCenter ? 'mb-1' : 'mb-1'}`}>{item.icon}</div>
            <span className={`text-xs font-medium truncate ${item.isCenter ? 'text-xs' : ''}`}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
