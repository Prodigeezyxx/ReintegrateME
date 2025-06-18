
import React from 'react';
import { SwipeableCardData } from '../models/types';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

interface FavoritesBarProps {
  favorites: SwipeableCardData[];
  onFavoriteClick: (favorite: SwipeableCardData) => void;
  onRemoveFavorite: (favorite: SwipeableCardData) => void;
  title?: string;
}

const FavoritesBar: React.FC<FavoritesBarProps> = ({ 
  favorites, 
  onFavoriteClick, 
  onRemoveFavorite,
  title = "Favorites"
}) => {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="favorites-container animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800 font-geist">{title}</h2>
        <div className="ml-auto bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
          {favorites.length}
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex-shrink-0 relative"
            style={{ width: '120px' }}
          >
            <div 
              className="favorite-item w-full h-28 bg-gradient-to-br from-white to-slate-50 border border-slate-200 cursor-pointer"
              onClick={() => onFavoriteClick(favorite)}
              role="button"
              tabIndex={0}
              aria-label={`View ${favorite.titleText} profile`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onFavoriteClick(favorite);
                }
              }}
            >
              {favorite.primaryImageUrl ? (
                <img
                  src={favorite.primaryImageUrl}
                  alt={favorite.titleText}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200">
                  {favorite.type === 'job' ? '💼' : '👤'}
                </div>
              )}
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full w-7 h-7 p-1 beautiful-shadow-subtle hover:shadow-md transition-all duration-200 border border-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(favorite);
              }}
              aria-label={`Remove ${favorite.titleText} from favorites`}
            >
              <X className="h-3 w-3" />
            </Button>
            
            <div className="mt-2 px-1">
              <p className="text-xs font-semibold text-slate-800 truncate font-geist" title={favorite.titleText}>
                {favorite.titleText}
              </p>
              {favorite.subtitleText && (
                <p className="text-xs text-slate-500 truncate mt-0.5 font-geist" title={favorite.subtitleText}>
                  {favorite.subtitleText}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesBar;
