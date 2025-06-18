
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SwipeableCardData } from '../models/types';
import { Eye } from 'lucide-react';

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
      className={`swipe-card ios-card relative ${isInteractive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={isDragging ? handleEnd : undefined}
    >
      {/* Swipe Direction Overlays */}
      {isInteractive && (
        <>
          {swipeDirection === 'right' && (
            <div className="absolute top-8 right-8 transform rotate-[-15deg] bg-green-500 text-white py-2 px-4 rounded-lg border-2 border-white text-xl font-bold z-20 animate-scale-in">
              LIKE
            </div>
          )}
          
          {swipeDirection === 'left' && (
            <div className="absolute top-8 left-8 transform rotate-[15deg] bg-red-500 text-white py-2 px-4 rounded-lg border-2 border-white text-xl font-bold z-20 animate-scale-in">
              PASS
            </div>
          )}

          {swipeDirection === 'up' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg border-2 border-white text-xl font-bold z-20 animate-scale-in">
              SUPER!
            </div>
          )}
        </>
      )}
      
      {/* View More Button */}
      {onViewMore && isInteractive && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewMore}
            className="bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-105"
          >
            <Eye className="h-4 w-4 mr-1" />
            View More
          </Button>
        </div>
      )}
      
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Image section */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-4xl font-bold text-gray-400">
                {card.type === 'job' ? '💼' : '👤'}
              </span>
            </div>
          )}
          
          {/* Disclosure indicator for seekers */}
          {card.type === 'seeker' && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Disclosure Available
              </div>
            </div>
          )}
        </div>
        
        {/* Content section */}
        <div className="p-5 flex-grow">
          <h3 className="text-xl font-bold mb-1 text-gray-800">{card.titleText}</h3>
          
          {card.subtitleText && (
            <p className="text-gray-600 mb-3">{card.subtitleText}</p>
          )}
          
          {card.detailLine1 && (
            <p className="text-sm text-gray-500 mb-2">
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {card.detailLine1}
              </span>
            </p>
          )}
          
          {card.detailLine2 && (
            <p className="text-sm text-gray-500 mb-4">
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {card.detailLine2}
              </span>
            </p>
          )}
          
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {card.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" className="bg-gray-100">
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
