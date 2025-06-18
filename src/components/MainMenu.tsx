
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { authAPI } from '../services/api';
import { UserRole } from '../models/types';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Search,
  LogOut
} from 'lucide-react';

interface MainMenuProps {
  children?: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const MainMenu: React.FC<MainMenuProps> = ({ children }) => {
  const location = useLocation();
  const currentUser = authAPI.getCurrentUser();
  const userRole = currentUser?.role as UserRole;
  
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
      label: 'Discover',
      path: '/seeker-dashboard',
      icon: <Search className="h-5 w-5" />
    },
    {
      label: 'Search',
      path: '/seeker-search',
      icon: <Search className="h-5 w-5" />
    },
    {
      label: 'Applications',
      path: '/seeker-applications',
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      label: 'Messages',
      path: '/seeker-messages',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      label: 'Profile',
      path: '/seeker-profile',
      icon: <Users className="h-5 w-5" />
    }
  ];
  
  const navItems = userRole ? (userRole === 'hirer' ? getHirerNavItems() : getSeekerNavItems()) : [];
  
  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/';
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <div className="py-4">
          {userRole ? (
            <>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-muted-foreground">Navigation</p>
              </div>
              <nav className="space-y-1 px-2">
                {navItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
                    `}
                  >
                    <div className="mr-3">{item.icon}</div>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              
              <div className="mt-6 px-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </>
          ) : (
            <div className="px-4">
              <p className="text-muted-foreground">Please sign in to access the menu.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainMenu;
