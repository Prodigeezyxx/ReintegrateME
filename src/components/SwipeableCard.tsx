import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SwipeableCardData } from '../models/types';
import { Eye, MapPin, Briefcase } from 'lucide-react';

interface SwipeableCardProps {
  card: SwipeableCardData;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onViewMore?: (card: SwipeableCardData) => void;
  isInteractive?: boolean;
  imagePreloaded?: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  card, 
  onSwipe, 
  onViewMore, 
  isInteractive = true,
  imagePreloaded = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'none'>('none');
  const [imageLoaded, setImageLoaded] = useState(imagePreloaded);
  const [imageError, setImageError] = useState(false);
  
  const dragThreshold = 100;
  const velocityThreshold = 0.5;
  
  useEffect(() => {
    if (imagePreloaded) {
      setImageLoaded(true);
    }
  }, [imagePreloaded]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    setStartX(e.clientX);
    setStartY(e.clientY);
    setIsDragging(true);
  };
  
  const updateCardTransform = (x: number, y: number) => {
    const angle = Math.max(-30, Math.min(30, x / 10));
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${angle}deg)`;
    }
    
    // Update swipe direction for visual feedback
    if (Math.abs(y) > Math.abs(x) && y < -50) {
      setSwipeDirection('up');
    } else if (x > 50) {
      setSwipeDirection('right');
    } else if (x < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection('none');
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !isInteractive) return;
    
    const x = e.touches[0].clientX - startX;
    const y = e.touches[0].clientY - startY;
    setCurrentX(x);
    setCurrentY(y);
    
    updateCardTransform(x, y);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !isInteractive) return;
    
    const x = e.clientX - startX;
    const y = e.clientY - startY;
    setCurrentX(x);
    setCurrentY(y);
    
    updateCardTransform(x, y);
  };
  
  const resetCard = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = '';
        }
      }, 300);
    }
    
    setCurrentX(0);
    setCurrentY(0);
    setSwipeDirection('none');
  };
  
  const executeSwipe = (direction: 'left' | 'right' | 'up') => {
    if (cardRef.current) {
      const exitDistance = window.innerWidth * 1.2;
      let transform = '';
      
      if (direction === 'left') {
        transform = `translateX(-${exitDistance}px) rotate(-30deg)`;
      } else if (direction === 'right') {
        transform = `translateX(${exitDistance}px) rotate(30deg)`;
      } else if (direction === 'up') {
        transform = `translateY(-${window.innerHeight}px) scale(0.8)`;
      }
      
      cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      cardRef.current.style.transform = transform;
      
      setTimeout(() => {
        onSwipe(direction);
      }, 150); // Trigger callback slightly before animation completes
    }
  };
  
  const handleEnd = () => {
    if (!isInteractive) return;
    setIsDragging(false);
    
    const absX = Math.abs(currentX);
    const absY = Math.abs(currentY);
    
    if (absX > dragThreshold) {
      executeSwipe(currentX > 0 ? 'right' : 'left');
    } else if (absY > dragThreshold && currentY < 0) {
      executeSwipe('up');
    } else {
      resetCard();
    }
  };

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewMore && isInteractive) {
      onViewMore(card);
    }
  };

  const getImageSrc = () => {
    if (card.primaryImageUrl) return card.primaryImageUrl;
    
    // Default placeholder based on card type
    if (card.type === 'job') {
      return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop';
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`swipe-card ios-card relative ${isInteractive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} overflow-hidden`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={isDragging ? handleEnd : undefined}
    >
      {/* Enhanced Swipe Direction Overlays */}
      {isInteractive && (
        <>
          {swipeDirection === 'right' && (
            <div className="absolute top-8 right-8 transform rotate-[-15deg] bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-xl border-2 border-white text-xl font-bold z-20 animate-scale-in beautiful-shadow font-geist">
              LIKE
            </div>
          )}
          
          {swipeDirection === 'left' && (
            <div className="absolute top-8 left-8 transform rotate-[15deg] bg-gradient-to-r from-red-500 to-rose-500 text-white py-2 px-4 rounded-xl border-2 border-white text-xl font-bold z-20 animate-scale-in beautiful-shadow font-geist">
              PASS
            </div>
          )}

          {swipeDirection === 'up' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl border-2 border-white text-xl font-bold z-20 animate-scale-in beautiful-shadow font-geist">
              SUPER!
            </div>
          )}
        </>
      )}
      
      {/* Enhanced View More Button */}
      {onViewMore && isInteractive && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewMore}
            className="bg-white/90 hover:bg-white beautiful-shadow-subtle hover:beautiful-shadow transition-all duration-200 hover:scale-105 border-0 font-geist"
          >
            <Eye className="h-4 w-4 mr-1" />
            View More
          </Button>
        </div>
      )}
      
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Enhanced Image section */}
        <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-300 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {!imageError && (
            <img 
              src={getImageSrc()}
              alt={card.titleText}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          )}
          
          {imageError && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
              <span className="text-4xl font-bold text-slate-400">
                {card.type === 'job' ? '💼' : '👤'}
              </span>
            </div>
          )}
          
          {/* Enhanced disclosure indicator for seekers */}
          {card.type === 'seeker' && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center beautiful-shadow-subtle font-geist">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Disclosure Available
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Content section */}
        <div className="p-5 flex-grow bg-gradient-to-b from-white to-slate-50">
          <h3 className="text-xl font-bold mb-1 text-slate-800 font-geist">{card.titleText}</h3>
          
          {card.subtitleText && (
            <p className="text-slate-600 mb-3 font-medium">{card.subtitleText}</p>
          )}
          
          {card.detailLine1 && (
            <p className="text-sm text-slate-500 mb-2 font-geist">
              <span className="inline-flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                {card.detailLine1}
              </span>
            </p>
          )}
          
          {card.detailLine2 && (
            <p className="text-sm text-slate-500 mb-4 font-geist">
              <span className="inline-flex items-center">
                <Briefcase className="h-4 w-4 mr-1 text-slate-400" />
                {card.detailLine2}
              </span>
            </p>
          )}
          
          {/* Enhanced Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {card.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-600 font-geist beautiful-shadow-subtle">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-indigo-600 font-geist beautiful-shadow-subtle">
                  +{card.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeableCard;
