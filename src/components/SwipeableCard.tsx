import React, { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SwipeableCardData } from '../models/types';
import { Eye } from 'lucide-react';

interface SwipeableCardProps {
  card: SwipeableCardData;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onViewMore?: (card: SwipeableCardData) => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ card, onSwipe, onViewMore }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'none'>('none');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const dragThreshold = 100;
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
    setStartY(e.clientY);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    setCurrentX(x - startX);
    setCurrentY(y - startY);
    
    const angle = currentX / 10;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${angle}deg)`;
    }
    
    // Determine swipe direction for visual feedback
    if (currentX > 50) {
      setSwipeDirection('right');
    } else if (currentX < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection('none');
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const x = e.clientX;
    const y = e.clientY;
    setCurrentX(x - startX);
    setCurrentY(y - startY);
    
    const angle = currentX / 10;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${angle}deg)`;
    }
    
    // Determine swipe direction for visual feedback
    if (currentX > 50) {
      setSwipeDirection('right');
    } else if (currentX < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection('none');
    }
  };
  
  const resetCard = () => {
    if (cardRef.current && !isAnimating) {
      cardRef.current.style.transition = 'transform 0.3s ease';
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
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(currentX) > dragThreshold) {
      setIsAnimating(true);
      const direction = currentX > 0 ? 'right' : 'left';
      
      if (cardRef.current) {
        const endX = direction === 'right' ? window.innerWidth : -window.innerWidth;
        const angle = direction === 'right' ? 30 : -30;
        
        cardRef.current.style.transition = 'transform 0.3s ease';
        cardRef.current.style.transform = `translateX(${endX}px) rotate(${angle}deg)`;
        
        setTimeout(() => {
          onSwipe(direction);
          setIsAnimating(false);
          resetCard();
        }, 300);
      }
    } else if (Math.abs(currentY) > dragThreshold && currentY < 0) {
      setIsAnimating(true);
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease';
        cardRef.current.style.transform = 'translateY(-1000px) scale(0.8)';
        
        setTimeout(() => {
          onSwipe('up');
          setIsAnimating(false);
          resetCard();
        }, 300);
      }
    } else {
      resetCard();
    }
  };
  
  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewMore) {
      onViewMore(card);
    }
  };

  return (
    <div 
      ref={cardRef}
      className="swipe-card ios-card cursor-grab active:cursor-grabbing relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={isDragging ? handleMouseUp : undefined}
    >
      {/* Overlay indicators for swipe direction */}
      {swipeDirection === 'right' && (
        <div className="absolute top-5 right-5 transform rotate-[-15deg] bg-green-500 text-white py-1 px-3 rounded-lg border-2 border-white text-2xl font-bold z-10">
          LIKE
        </div>
      )}
      
      {swipeDirection === 'left' && (
        <div className="absolute top-5 left-5 transform rotate-[15deg] bg-red-500 text-white py-1 px-3 rounded-lg border-2 border-white text-2xl font-bold z-10">
          PASS
        </div>
      )}
      
      {/* View More Button */}
      {onViewMore && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewMore}
            className="bg-white/90 hover:bg-white shadow-md"
          >
            <Eye className="h-4 w-4 mr-1" />
            View More
          </Button>
        </div>
      )}
      
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Image section */}
        <div className="relative h-64 bg-gray-100">
          {card.primaryImageUrl ? (
            <img 
              src={card.primaryImageUrl} 
              alt={card.titleText}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-4xl font-bold text-gray-400">
                {card.type === 'job' ? 'JOB' : card.titleText.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Disclosure indicator for seekers */}
          {card.type === 'seeker' && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
