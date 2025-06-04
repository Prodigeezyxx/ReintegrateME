
import React, { useState, useEffect } from 'react';
import { jobAPI, swipeAPI } from '../../services/api';
import { SwipeableCardData } from '../../models/types';
import SwipeableCard from '../SwipeableCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MatchAnimation from '../MatchAnimation';
import FavoritesBar from '../FavoritesBar';
import SeekerProfileView from '../SeekerProfileView';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const HirerDiscover = () => {
  const [seekers, setSeekers] = useState<SwipeableCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [favorites, setFavorites] = useState<SwipeableCardData[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<SwipeableCardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  
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
      
      // Create mock seekers data for guest users
      const mockSeekers: SwipeableCardData[] = [
        {
          id: '1',
          type: 'seeker',
          primaryImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          titleText: 'Marcus Thompson',
          subtitleText: 'Experienced Carpenter',
          detailLine1: 'London, UK',
          detailLine2: '5+ years experience',
          tags: ['Carpentry', 'Framing', 'Finishing Work']
        },
        {
          id: '2',
          type: 'seeker',
          primaryImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          titleText: 'Sarah Mitchell',
          subtitleText: 'Licensed Electrician',
          detailLine1: 'Manchester, UK',
          detailLine2: '3 years experience',
          tags: ['Electrical Systems', 'Wiring', 'Troubleshooting', 'Health & Safety']
        },
        {
          id: '3',
          type: 'seeker',
          primaryImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          titleText: 'David Kumar',
          subtitleText: 'Construction Specialist',
          detailLine1: 'Birmingham, UK',
          detailLine2: '8 years experience',
          tags: ['Heavy Machinery', 'Site Management', 'Quality Control']
        },
        {
          id: '4',
          type: 'seeker',
          primaryImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          titleText: 'James Wilson',
          subtitleText: 'Professional Driver',
          detailLine1: 'Leeds, UK',
          detailLine2: '4 years experience',
          tags: ['HGV Licence', 'Navigation', 'Customer Service', 'Time Management']
        },
        {
          id: '5',
          type: 'seeker',
          primaryImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          titleText: 'Lisa Chen',
          subtitleText: 'Certified Electrician',
          detailLine1: 'Glasgow, UK',
          detailLine2: '6 years experience',
          tags: ['Industrial Electrical', 'Motor Controls', 'PLC Programming']
        },
        {
          id: '6',
          type: 'seeker',
          primaryImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
          titleText: 'Robert Taylor',
          subtitleText: 'Construction Worker',
          detailLine1: 'Sheffield, UK',
          detailLine2: 'Recent graduate',
          tags: ['Basic Construction', 'Eager to Learn', 'Reliable']
        },
        {
          id: '7',
          type: 'seeker',
          primaryImageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
          titleText: 'Ana Kowalski',
          subtitleText: 'Delivery Specialist',
          detailLine1: 'Liverpool, UK',
          detailLine2: 'Multi-drop expert',
          tags: ['Route Optimization', 'Customer Relations', 'Van Maintenance']
        },
        {
          id: '8',
          type: 'seeker',
          titleText: 'Mohammed Ali',
          subtitleText: 'Commercial Plumber',
          detailLine1: 'Edinburgh, UK',
          detailLine2: '7 years experience',
          tags: ['Commercial Systems', 'Emergency Repairs', 'Team Leadership']
        }
      ];
      
      setSeekers(mockSeekers);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error loading talent profiles:', error);
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
    if (seekers.length === 0 || currentIndex >= seekers.length) return;
    
    const currentSeeker = seekers[currentIndex];
    let swipeType: 'like' | 'pass' | 'super_like';
    
    if (direction === 'right') {
      swipeType = 'like';
      
      // Add to favorites when swiping right
      if (!favorites.some(fav => fav.id === currentSeeker.id)) {
        setFavorites(prev => [...prev, currentSeeker]);
        toast({
          title: "Added to favorites",
          description: `${currentSeeker.titleText} has been added to your favorites.`,
        });
      }
    }
    else if (direction === 'left') swipeType = 'pass';
    else swipeType = 'super_like';
    
    try {
      // Simulate match for demonstration (30% chance)
      const isMatch = Math.random() < 0.3 && direction !== 'left';
      
      if (isMatch) {
        setShowMatch(true);
        toast({
          title: "It's a Match!",
          description: `You and ${currentSeeker.titleText} liked each other!`,
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
    if (seekers.length === 0 || currentIndex >= seekers.length) return;
    
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
  
  const renderCards = () => {
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
      <SwipeableCard
        card={seekers[currentIndex]}
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
        
        {user?.isGuest && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              👀 <strong>Guest Mode:</strong> These are sample talent profiles to show you how the platform works
            </p>
          </div>
        )}
        
        <FavoritesBar 
          favorites={favorites} 
          onFavoriteClick={handleFavoriteProfileClick}
          onRemoveFavorite={handleRemoveFavorite}
          title="Favorite Talent"
        />
        
        <div className="swipe-card-container mb-6">
          {renderCards()}
        </div>
        
        {seekers.length > 0 && currentIndex < seekers.length && (
          <div className="swipe-action-buttons">
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
        
        {showMatch && <MatchAnimation type="seeker" />}
      </div>
    </div>
  );
};

export default HirerDiscover;
