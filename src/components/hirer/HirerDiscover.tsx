import React, { useState, useEffect } from 'react';
import { jobAPI, swipeAPI } from '../../services/api';
import { SwipeableCardData } from '../../models/types';
import CardStack from '../CardStack';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MatchAnimation from '../MatchAnimation';
import FavoritesBar from '../FavoritesBar';
import SeekerProfileView from '../SeekerProfileView';
import { RefreshCw } from 'lucide-react';

const HirerDiscover = () => {
  const [seekers, setSeekers] = useState<SwipeableCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [favorites, setFavorites] = useState<SwipeableCardData[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<SwipeableCardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  
  useEffect(() => {
    fetchSeekers();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('hirerFavorites');
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
    localStorage.setItem('hirerFavorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const fetchSeekers = async () => {
    try {
      setIsRefreshing(true);
      const data = await jobAPI.getSeekersFeed();
      setSeekers(data);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load talent profiles",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (seekers.length === 0 || currentIndex >= seekers.length || isSwipeAnimating) return;
    
    setIsSwipeAnimating(true);
    const currentSeeker = seekers[currentIndex];
    let swipeType: 'like' | 'pass' | 'super_like';
    
    if (direction === 'right') {
      swipeType = 'like';
      
      if (!favorites.some(fav => fav.id === currentSeeker.id)) {
        setFavorites(prev => [...prev, currentSeeker]);
      }
    }
    else if (direction === 'left') swipeType = 'pass';
    else swipeType = 'super_like';
    
    try {
      const result = await swipeAPI.processSwipe(
        currentSeeker.id,
        'seeker',
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
    if (seekers.length === 0 || currentIndex >= seekers.length || isSwipeAnimating) return;
    
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
  
  const handleViewMoreProfile = (profile: SwipeableCardData) => {
    setSelectedProfile(profile);
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
    fetchSeekers();
  };
  
  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading talent profiles...</p>
          </div>
        </div>
      );
    }
    
    if (seekers.length === 0) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No talent found</h3>
            <p className="text-gray-500">We couldn't find any talent profiles matching your criteria.</p>
          </div>
        </div>
      );
    }
    
    if (currentIndex >= seekers.length) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-reme-orange mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
            <p className="text-gray-500 mb-4">Check back later for more talent profiles.</p>
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
        cards={seekers}
        currentIndex={currentIndex}
        onSwipe={handleSwipe}
        onViewMore={handleViewMoreProfile}
        isAnimating={isSwipeAnimating}
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
        showContactButton={true}
      />
    );
  }
  
  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discover Talent</h1>
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
          onFavoriteClick={handleFavoriteProfileClick}
          onRemoveFavorite={handleRemoveFavorite}
          title="Favorite Talent"
        />
        
        <div className="swipe-card-container mb-6 relative">
          {renderMainContent()}
        </div>
        
        {seekers.length > 0 && currentIndex < seekers.length && (
          <div className="swipe-action-buttons">
            <button 
              className="swipe-button pass-button"
              onClick={() => handleButtonSwipe('left')}
              aria-label="Pass"
              disabled={isSwipeAnimating}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              className="swipe-button super-like-button"
              onClick={() => handleButtonSwipe('up')}
              aria-label="Super like"
              disabled={isSwipeAnimating}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            
            <button 
              className="swipe-button like-button"
              onClick={() => handleButtonSwipe('right')}
              aria-label="Like"
              disabled={isSwipeAnimating}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        )}
        
        {showMatch && <MatchAnimation type="seeker" />}
      </div>
    </div>
  );
};

export default HirerDiscover;
