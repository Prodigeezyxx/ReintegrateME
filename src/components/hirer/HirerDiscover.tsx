import React, { useState, useEffect } from 'react';
import { jobAPI, swipeAPI } from '../../services/api';
import { SwipeableCardData } from '../../models/types';
import CardStack from '../CardStack';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MatchAnimation from '../MatchAnimation';
import FavoritesBar from '../FavoritesBar';
import SeekerProfileView from '../SeekerProfileView';
import SkeletonLoader from '../SkeletonLoader';
import { RefreshCw, Users, X, Bookmark, Check } from 'lucide-react';
import { getLogoUrl } from '../../utils/logoUpload';

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
        <div className="swipe-card-container flex items-center justify-center">
          <SkeletonLoader variant="card" className="w-full h-full" />
        </div>
      );
    }
    
    if (seekers.length === 0) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-8 animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <img 
                src={getLogoUrl()} 
                alt="ReintegrateMe"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  console.log('Logo failed to load:', getLogoUrl());
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully:', getLogoUrl());
                }}
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 font-geist">No talent found</h3>
            <p className="text-slate-600 font-geist leading-relaxed">We couldn't find any talent profiles matching your criteria. Try adjusting your search filters.</p>
          </div>
        </div>
      );
    }
    
    if (currentIndex >= seekers.length) {
      return (
        <div className="swipe-card ios-card flex items-center justify-center">
          <div className="text-center p-8 animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
              <Users className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 font-geist">You're all caught up!</h3>
            <p className="text-slate-600 mb-6 font-geist leading-relaxed">Check back later for more talent profiles.</p>
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
    <div className="mobile-container safe-top bg-gradient-to-b from-white to-slate-50">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6 p-6 pb-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-geist">Discover Talent</h1>
            <p className="text-slate-600 text-sm font-geist mt-1">Find your ideal candidates</p>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={getLogoUrl()} 
              alt="ReintegrateMe"
              className="h-10 w-10 object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                console.log('Header logo failed to load:', getLogoUrl());
              }}
              onLoad={() => {
                console.log('Header logo loaded successfully:', getLogoUrl());
              }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="relative rounded-xl hover:bg-slate-100 transition-all duration-200 touch-target"
              aria-label="Refresh talent profiles"
            >
              <RefreshCw className={`h-5 w-5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="px-6">
          <FavoritesBar 
            favorites={favorites} 
            onFavoriteClick={handleFavoriteProfileClick}
            onRemoveFavorite={handleRemoveFavorite}
            title="Favorite Talent"
          />
        </div>
        
        <div className="px-6 flex-1 flex flex-col">
          <div className="swipe-card-container mb-4 relative">
            {renderMainContent()}
          </div>
          
          {seekers.length > 0 && currentIndex < seekers.length && (
            <div className="flex justify-center items-center gap-6 pb-8 mt-4">
              {/* Pass/Decline Button - Red X */}
              <button 
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleButtonSwipe('left')}
                aria-label="Pass on this candidate"
                disabled={isSwipeAnimating}
              >
                <X className="h-8 w-8 group-hover:scale-110 transition-transform duration-200" strokeWidth={2.5} />
              </button>
              
              {/* Save Button - Orange Bookmark */}
              <button 
                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleButtonSwipe('up')}
                aria-label="Save this candidate"
                disabled={isSwipeAnimating}
              >
                <Bookmark className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" strokeWidth={2.5} />
              </button>
              
              {/* Accept/Like Button - Green Check */}
              <button 
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleButtonSwipe('right')}
                aria-label="Accept this candidate"
                disabled={isSwipeAnimating}
              >
                <Check className="h-8 w-8 group-hover:scale-110 transition-transform duration-200" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
        
        {showMatch && <MatchAnimation type="seeker" />}
      </div>
    </div>
  );
};

export default HirerDiscover;
