
import React, { useState, useEffect } from 'react';
import { jobAPI, swipeAPI } from '../../services/api';
import { SwipeableCardData } from '../../models/types';
import CardStack from '../CardStack';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MatchAnimation from '../MatchAnimation';
import FavoritesBar from '../FavoritesBar';
import JobDetailView from './JobDetailView';
import { RefreshCw, X, Bookmark, Check } from 'lucide-react';

const SeekerHome = () => {
  const [jobs, setJobs] = useState<SwipeableCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [favorites, setFavorites] = useState<SwipeableCardData[]>([]);
  const [selectedJob, setSelectedJob] = useState<SwipeableCardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  
  useEffect(() => {
    fetchJobs();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('seekerFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage', error);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save favorites to localStorage when updated
    localStorage.setItem('seekerFavorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const fetchJobs = async () => {
    try {
      setIsRefreshing(true);
      const data = await jobAPI.getJobsFeed();
      setJobs(data);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job opportunities",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (jobs.length === 0 || currentIndex >= jobs.length || isSwipeAnimating) return;
    
    setIsSwipeAnimating(true);
    const currentJob = jobs[currentIndex];
    let swipeType: 'like' | 'pass' | 'super_like';
    
    if (direction === 'right') {
      swipeType = 'like';
      
      if (!favorites.some(fav => fav.id === currentJob.id)) {
        setFavorites(prev => [...prev, currentJob]);
      }
    }
    else if (direction === 'left') swipeType = 'pass';
    else swipeType = 'super_like';
    
    try {
      const result = await swipeAPI.processSwipe(
        currentJob.id,
        'job',
        swipeType
      );
      
      if (result.isMatch) {
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process swipe",
        variant: "destructive"
      });
    }
    
    // Move to next card after a short delay
    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setIsSwipeAnimating(false);
    }, 200);
  };
  
  const handleButtonSwipe = (direction: 'left' | 'right' | 'up') => {
    if (jobs.length === 0 || currentIndex >= jobs.length || isSwipeAnimating) return;
    
    // Find the current card and trigger animation
    const card = document.querySelector('.swipe-card') as HTMLElement;
    
    if (card) {
      const exitDistance = window.innerWidth * 1.2;
      card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      if (direction === 'left') {
        card.style.transform = `translateX(-${exitDistance}px) rotate(-30deg)`;
      } else if (direction === 'right') {
        card.style.transform = `translateX(${exitDistance}px) rotate(30deg)`;
      } else if (direction === 'up') {
        card.style.transform = `translateY(-${window.innerHeight}px) scale(0.8)`;
      }
      
      setTimeout(() => {
        handleSwipe(direction);
      }, 150);
    }
  };
  
  const handleViewMoreJob = (job: SwipeableCardData) => {
    setSelectedJob(job);
  };
  
  const handleFavoriteJobClick = (job: SwipeableCardData) => {
    setSelectedJob(job);
  };
  
  const handleRemoveFavorite = (job: SwipeableCardData) => {
    setFavorites(prev => prev.filter(fav => fav.id !== job.id));
    toast({
      title: "Removed from saved jobs",
      description: `${job.titleText} has been removed from your saved jobs.`,
    });
  };
  
  const handleToggleFavorite = () => {
    if (!selectedJob) return;
    
    const isFavorited = favorites.some(fav => fav.id === selectedJob.id);
    
    if (isFavorited) {
      setFavorites(prev => prev.filter(fav => fav.id !== selectedJob.id));
      toast({
        title: "Removed from saved jobs",
        description: `${selectedJob.titleText} has been removed from your saved jobs.`,
      });
    } else {
      setFavorites(prev => [...prev, selectedJob]);
      toast({
        title: "Added to saved jobs",
        description: `${selectedJob.titleText} has been added to your saved jobs.`,
      });
    }
  };
  
  const handleRefresh = () => {
    setCurrentIndex(0);
    fetchJobs();
  };
  
  // Convert SwipeableCardData to the format expected by JobDetailView
  const convertToJobDetailFormat = (job: SwipeableCardData) => {
    return {
      id: parseInt(job.id),
      jobTitle: job.titleText,
      company: job.subtitleText || 'Company Name',
      location: job.detailLine1 || 'Location',
      salary: job.detailLine2 || '',
      employmentType: job.tags?.[0] || 'Full-time',
      description: `Job description for ${job.titleText}`,
      requirements: job.tags || [],
      benefits: []
    };
  };
  
  const renderMainContent = () => {
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
            <p className="text-gray-500">We couldn't find any job opportunities matching your criteria.</p>
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
      <CardStack
        cards={jobs}
        currentIndex={currentIndex}
        onSwipe={handleSwipe}
        onViewMore={handleViewMoreJob}
        isAnimating={isSwipeAnimating}
      />
    );
  };
  
  // If we're showing a specific job, render the job detail view
  if (selectedJob) {
    const isFavorite = favorites.some(fav => fav.id === selectedJob.id);
    const jobDetailData = convertToJobDetailFormat(selectedJob);
    
    return (
      <JobDetailView 
        job={jobDetailData}
        onBackClick={() => setSelectedJob(null)}
        isFavorite={isFavorite}
        onFavoriteToggle={handleToggleFavorite}
        showApplyButton={true}
      />
    );
  }
  
  return (
    <div className="mobile-container p-6">
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
        
        <FavoritesBar 
          favorites={favorites} 
          onFavoriteClick={handleFavoriteJobClick}
          onRemoveFavorite={handleRemoveFavorite}
          title="Saved Jobs"
        />
        
        <div className="swipe-card-container mb-6 relative">
          {renderMainContent()}
        </div>
        
        {jobs.length > 0 && currentIndex < jobs.length && (
          <div className="swipe-action-buttons">
            <button 
              className="swipe-button pass-button"
              onClick={() => handleButtonSwipe('left')}
              aria-label="Pass"
              disabled={isSwipeAnimating}
            >
              <X className="h-8 w-8" />
            </button>
            
            <button 
              className="swipe-button super-like-button"
              onClick={() => handleButtonSwipe('up')}
              aria-label="Save job"
              disabled={isSwipeAnimating}
            >
              <Bookmark className="h-8 w-8" />
            </button>
            
            <button 
              className="swipe-button like-button"
              onClick={() => handleButtonSwipe('right')}
              aria-label="Like"
              disabled={isSwipeAnimating}
            >
              <Check className="h-8 w-8" />
            </button>
          </div>
        )}
        
        {showMatch && <MatchAnimation type="job" />}
      </div>
    </div>
  );
};

export default SeekerHome;
