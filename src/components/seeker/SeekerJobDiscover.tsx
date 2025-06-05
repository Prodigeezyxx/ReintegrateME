
import React, { useState, useEffect } from 'react';
import { jobAPI, swipeAPI } from '../../services/api';
import { SwipeableCardData } from '../../models/types';
import SwipeableCard from '../SwipeableCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MatchAnimation from '../MatchAnimation';
import FavoritesBar from '../FavoritesBar';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SeekerJobDiscover = () => {
  const [jobs, setJobs] = useState<SwipeableCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [savedJobs, setSavedJobs] = useState<SwipeableCardData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchJobs();
    
    // Load saved jobs from localStorage
    const savedJobsData = localStorage.getItem('seekerSavedJobs');
    if (savedJobsData) {
      try {
        setSavedJobs(JSON.parse(savedJobsData));
      } catch (error) {
        console.error('Error parsing saved jobs from localStorage', error);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save liked jobs to localStorage when updated
    localStorage.setItem('seekerSavedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);
  
  const fetchJobs = async () => {
    try {
      setIsRefreshing(true);
      
      // Create mock jobs data for guest users since they can't access real job feed
      const mockJobs: SwipeableCardData[] = [
        {
          id: '1',
          type: 'job',
          primaryImageUrl: 'https://placehold.co/100x100?text=BP',
          titleText: 'Senior Construction Worker',
          subtitleText: 'BuildPro Construction Ltd',
          detailLine1: 'London, UK',
          detailLine2: 'Full-time',
          tags: ['Construction Experience', 'Health & Safety', 'Physical Fitness']
        },
        {
          id: '2',
          type: 'job',
          primaryImageUrl: 'https://placehold.co/100x100?text=PT',
          titleText: 'Electrician - Residential Projects',
          subtitleText: 'PowerTech Solutions',
          detailLine1: 'Manchester, UK',
          detailLine2: 'Full-time',
          tags: ['Electrical Installation', '18th Edition', 'Testing & Inspection']
        },
        {
          id: '3',
          type: 'job',
          primaryImageUrl: 'https://placehold.co/100x100?text=LF',
          titleText: 'Warehouse Operative',
          subtitleText: 'LogiFlow Warehouse',
          detailLine1: 'Birmingham, UK',
          detailLine2: 'Full-time',
          tags: ['Physical Fitness', 'Attention to Detail', 'Team Work']
        },
        {
          id: '4',
          type: 'job',
          primaryImageUrl: 'https://placehold.co/100x100?text=CC',
          titleText: 'Plumber - Commercial',
          subtitleText: 'City Construction Group',
          detailLine1: 'Leeds, UK',
          detailLine2: 'Contract',
          tags: ['Plumbing Systems', 'Commercial Experience', 'Emergency Repairs']
        },
        {
          id: '5',
          type: 'job',
          titleText: 'Delivery Driver',
          subtitleText: 'Quick Logistics Ltd',
          detailLine1: 'Sheffield, UK',
          detailLine2: 'Part-time',
          tags: ['Valid Licence', 'Customer Service', 'Route Planning']
        }
      ];
      
      setJobs(mockJobs);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error loading job postings:', error);
      toast({
        title: "Error",
        description: "Failed to load job postings",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (jobs.length === 0 || currentIndex >= jobs.length) return;
    
    const currentJob = jobs[currentIndex];
    let swipeType: 'like' | 'pass' | 'super_like';
    
    if (direction === 'right') {
      swipeType = 'like';
      
      // Add to saved jobs when swiping right
      if (!savedJobs.some(job => job.id === currentJob.id)) {
        setSavedJobs(prev => [...prev, currentJob]);
        toast({
          title: "Job saved",
          description: `${currentJob.titleText} has been added to your saved jobs.`,
        });
      }
    }
    else if (direction === 'left') swipeType = 'pass';
    else swipeType = 'super_like';
    
    try {
      // Process the swipe
      const result = await swipeAPI.processSwipe(currentJob.id, 'job', swipeType);
      
      if (result.isMatch) {
        setShowMatch(true);
        toast({
          title: "It's a Match!",
          description: `You and ${currentJob.subtitleText} liked each other!`,
        });
        // Hide match animation after 3 seconds
        setTimeout(() => setShowMatch(false), 3000);
      }
    } catch (error) {
      console.error('Error processing swipe:', error);
    }
    
    // Move to next card
    setCurrentIndex(prevIndex => prevIndex + 1);
  };
  
  const handleButtonSwipe = (direction: 'left' | 'right' | 'up') => {
    if (jobs.length === 0 || currentIndex >= jobs.length) return;
    
    const card = document.querySelector('.swipe-card') as HTMLElement;
    
    if (card) {
      card.style.transition = 'transform 0.5s ease';
      
      if (direction === 'left') {
        card.style.transform = 'translateX(-1000px) rotate(-30deg)';
      } else if (direction === 'right') {
        card.style.transform = 'translateX(1000px) rotate(30deg)';
      } else if (direction === 'up') {
        card.style.transform = 'translateY(-1000px) scale(0.8)';
      }
      
      setTimeout(() => {
        handleSwipe(direction);
      }, 300);
    }
  };
  
  const handleSavedJobClick = (job: SwipeableCardData) => {
    // Could navigate to job details page in the future
    toast({
      title: "Job Details",
      description: `Opening details for ${job.titleText}`,
    });
  };
  
  const handleRemoveSavedJob = (job: SwipeableCardData) => {
    setSavedJobs(prev => prev.filter(savedJob => savedJob.id !== job.id));
    toast({
      title: "Removed from saved jobs",
      description: `${job.titleText} has been removed from your saved jobs.`,
    });
  };
  
  const handleRefresh = () => {
    setCurrentIndex(0);
    fetchJobs();
  };
  
  const renderCards = () => {
    if (isLoading) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading job opportunities...</p>
          </div>
        </div>
      );
    }
    
    if (jobs.length === 0) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No jobs found</h3>
            <p className="text-gray-500">We couldn't find any job postings matching your criteria.</p>
          </div>
        </div>
      );
    }
    
    if (currentIndex >= jobs.length) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-reme-orange mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
            <p className="text-gray-500 mb-4">Check back later for more job opportunities.</p>
            <Button 
              onClick={() => setCurrentIndex(0)}
              className="bg-reme-orange hover:bg-orange-600 transition-colors"
            >
              Start Over
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <SwipeableCard
        card={jobs[currentIndex]}
        onSwipe={handleSwipe}
      />
    );
  };
  
  return (
    <div className="mobile-container p-6 pb-24">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discover Jobs</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {user?.isGuest && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              👀 <strong>Guest Mode:</strong> These are sample job postings to show you how the platform works
            </p>
          </div>
        )}
        
        <FavoritesBar 
          favorites={savedJobs} 
          onFavoriteClick={handleSavedJobClick}
          onRemoveFavorite={handleRemoveSavedJob}
          title="Saved Jobs"
        />
        
        <div className="swipe-card-container mb-6">
          {renderCards()}
        </div>
        
        {jobs.length > 0 && currentIndex < jobs.length && (
          <div className="swipe-action-buttons mb-20">
            <button 
              className="swipe-button pass-button"
              onClick={() => handleButtonSwipe('left')}
              aria-label="Pass"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              className="swipe-button super-like-button"
              onClick={() => handleButtonSwipe('up')}
              aria-label="Super like"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            
            <button 
              className="swipe-button like-button"
              onClick={() => handleButtonSwipe('right')}
              aria-label="Like"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        )}
        
        {showMatch && <MatchAnimation type="job" />}
      </div>
    </div>
  );
};

export default SeekerJobDiscover;
