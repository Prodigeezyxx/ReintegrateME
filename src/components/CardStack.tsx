
import React, { useEffect, useState } from 'react';
import { SwipeableCardData } from '../models/types';
import SwipeableCard from './SwipeableCard';
import { imagePreloader } from '../services/imagePreloader';

interface CardStackProps {
  cards: SwipeableCardData[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onViewMore?: (card: SwipeableCardData) => void;
  isAnimating: boolean;
}

const CardStack: React.FC<CardStackProps> = ({
  cards,
  currentIndex,
  onSwipe,
  onViewMore,
  isAnimating
}) => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Preload images for current and next 2 cards
    const imagesToPreload = [];
    for (let i = currentIndex; i < Math.min(currentIndex + 3, cards.length); i++) {
      if (cards[i]?.primaryImageUrl) {
        imagesToPreload.push(cards[i].primaryImageUrl);
      }
    }

    if (imagesToPreload.length > 0) {
      imagePreloader.preloadImages(imagesToPreload).then(() => {
        setPreloadedImages(new Set(imagesToPreload));
      });
    }
  }, [cards, currentIndex]);

  const visibleCards = [];
  const maxVisibleCards = 3;

  for (let i = 0; i < maxVisibleCards && currentIndex + i < cards.length; i++) {
    const cardIndex = currentIndex + i;
    const card = cards[cardIndex];
    const zIndex = maxVisibleCards - i;
    const scale = 1 - (i * 0.02);
    const translateY = i * 4;
    const opacity = i === 0 ? 1 : 0.7;

    visibleCards.push(
      <div
        key={`${card.id}-${cardIndex}`}
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          zIndex,
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity: i === 0 || !isAnimating ? opacity : 0,
        }}
      >
        <SwipeableCard
          card={card}
          onSwipe={i === 0 ? onSwipe : () => {}}
          onViewMore={i === 0 ? onViewMore : undefined}
          isInteractive={i === 0 && !isAnimating}
          imagePreloaded={preloadedImages.has(card.primaryImageUrl || '')}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {visibleCards}
    </div>
  );
};

export default CardStack;
