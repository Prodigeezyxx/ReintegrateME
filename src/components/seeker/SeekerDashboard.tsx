import React, { useState, useEffect } from 'react';
import { jobAPI, swipeAPI } from '../../services/api';
import { SwipeableCardData } from '../../models/types';
import SwipeableCard from '../SwipeableCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MatchAnimation from '../MatchAnimation';
import FavoritesBar from '../FavoritesBar';
import SeekerProfileView from '../SeekerProfileView';
import SkeletonLoader from '../SkeletonLoader';
import { RefreshCw, Heart, X, Bookmark, Check } from 'lucide-react';
import { getLogoUrl } from '../../utils/logoUpload';

const SeekerDashboard = () => {
  const [jobs, setJobs] = useState<SwipeableCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [favorites, setFavorites] = useState<SwipeableCardData[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<SwipeableCardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
        description: "Failed to load job listings",
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
      
      // Add to favorites when swiping right
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
        // Hide match animation after 3 seconds
        setTimeout(() => setShowMatch(false), 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process swipe",
        variant: "destructive"
      });
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
        card.classList.add('animate-card-swipe-left');
      } else if (direction === 'right') {
        card.style.transform = 'translateX(1000px) rotate(30deg)';
        card.classList.add('animate-card-swipe-right');
      } else if (direction === 'up') {
        card.style.transform = 'translateY(-1000px) scale(0.8)';
      }
      
      setTimeout(() => {
        handleSwipe(direction);
      }, 300);
    }
  };
  
  const handleFavoriteProfileClick = (profile: SwipeableCardData) => {
    setSelectedProfile(profile);
  };
  
  const handleRemoveFavorite = (profile: SwipeableCardData) => {
    setFavorites(prev => prev.filter(fav => fav.id !== profile.id));
    toast({
      title: "Removed from favorites",
      description: `${profile.titleText} has been removed from your favorites.`,
    });
  };
  
  const handleToggleFavorite = () => {
    if (!selectedProfile) return;
    
    const isFavorited = favorites.some(fav => fav.id === selectedProfile.id);
    
    if (isFavorited) {
      setFavorites(prev => prev.filter(fav => fav.id !== selectedProfile.id));
      toast({
        title: "Removed from favorites",
        description: `${selectedProfile.titleText} has been removed from your favorites.`,
      });
    } else {
      setFavorites(prev => [...prev, selectedProfile]);
      toast({
        title: "Added to favorites",
        description: `${selectedProfile.titleText} has been added to your favorites.`,
      });
    }
  };
  
  const handleRefresh = () => {
    setCurrentIndex(0);
    fetchJobs();
  };
  
  const renderCards = () => {
    if (isLoading) {
      return (
        <div className="swipe-card-container flex items-center justify-center">
          <SkeletonLoader variant="card" className="w-full h-full" />
        </div>
      );
    }
    
    if (jobs.length === 0) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-8 animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <img 
                src={getLogoUrl()} 
                alt="ReintegrateMe"
                className="h-10 w-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 font-geist">No jobs found</h3>
            <p className="text-slate-600 font-geist leading-relaxed">We couldn't find any job listings matching your criteria. Try adjusting your preferences or check back later.</p>
          </div>
        </div>
      );
    }
    
    if (currentIndex >= jobs.length) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-8 animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 font-geist">You're all caught up!</h3>
            <p className="text-slate-600 mb-6 font-geist leading-relaxed">Check back later for more job opportunities.</p>
            <Button 
              onClick={() => setCurrentIndex(0)}
              className="modern-button-primary"
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
  
  // If we're showing a specific profile, render the profile view
  if (selectedProfile) {
    const isFavorite = favorites.some(fav => fav.id === selectedProfile.id);
    
    return (
      <SeekerProfileView 
        seeker={selectedProfile}
        onBackClick={() => setSelectedProfile(null)}
        isFavorite={isFavorite}
        onFavoriteToggle={handleToggleFavorite}
      />
    );
  }
  
  return (
    <div className="mobile-container safe-top bg-gradient-to-b from-white to-slate-50 min-h-screen">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6 p-6 pb-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-geist">Discover Jobs</h1>
            <p className="text-slate-600 text-sm font-geist mt-1">Find your perfect match</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative rounded-xl hover:bg-slate-100 transition-all duration-200 touch-target"
            aria-label="Refresh job listings"
          >
            <RefreshCw className={`h-5 w-5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="px-6">
          <FavoritesBar 
            favorites={favorites} 
            onFavoriteClick={handleFavoriteProfileClick}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </div>
        
        <div className="px-6 flex-1 flex flex-col">
          <div className="swipe-card-container mb-6">
            {renderCards()}
          </div>
          
          {jobs.length > 0 && currentIndex < jobs.length && (
            <div className="swipe-action-buttons mt-auto">
              <button 
                className="swipe-button pass-button"
                onClick={() => handleButtonSwipe('left')}
                aria-label="Pass on this job"
              >
                <X className="h-8 w-8" />
              </button>
              
              <button 
                className="swipe-button super-like-button"
                onClick={() => handleButtonSwipe('up')}
                aria-label="Save job"
              >
                <Bookmark className="h-8 w-8" />
              </button>
              
              <button 
                className="swipe-button like-button"
                onClick={() => handleButtonSwipe('right')}
                aria-label="Like this job"
              >
                <Check className="h-8 w-8" />
              </button>
            </div>
          )}
        </div>
        
        {showMatch && <MatchAnimation type="job" />}
      </div>
    </div>
  );
};

export default SeekerDashboard;
