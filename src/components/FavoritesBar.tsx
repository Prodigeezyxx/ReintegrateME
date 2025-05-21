
import React from 'react';
import { SwipeableCardData } from '../models/types';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface FavoritesBarProps {
  favorites: SwipeableCardData[];
  onFavoriteClick: (favorite: SwipeableCardData) => void;
  onRemoveFavorite: (favorite: SwipeableCardData) => void;
}

const FavoritesBar: React.FC<FavoritesBarProps> = ({ favorites, onFavoriteClick, onRemoveFavorite }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Favorites</h2>
      <div className="flex overflow-x-auto gap-3 pb-2 -mx-1 px-1">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex-shrink-0 relative"
            style={{ width: '100px' }}
          >
            <div 
              className="w-full h-24 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden cursor-pointer"
              onClick={() => onFavoriteClick(favorite)}
            >
              {favorite.primaryImageUrl ? (
                <img
                  src={favorite.primaryImageUrl}
                  alt={favorite.titleText}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 bg-gray-200">
                  {favorite.titleText.charAt(0)}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full w-6 h-6 p-1 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(favorite);
              }}
            >
              <Heart className="h-4 w-4 fill-current text-red-500" />
            </Button>
            
            <p className="text-xs font-medium text-center mt-1 truncate">{favorite.titleText}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesBar;
