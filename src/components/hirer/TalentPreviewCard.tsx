
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SwipeableCardData } from '../../models/types';

interface TalentPreviewCardProps {
  talent: SwipeableCardData;
  onClick: () => void;
}

const TalentPreviewCard: React.FC<TalentPreviewCardProps> = ({ talent, onClick }) => {
  return (
    <Card 
      className="min-w-[200px] beautiful-shadow-subtle hover:beautiful-shadow cursor-pointer transition-all duration-200 hover:scale-105 border-0 bg-gradient-to-br from-white to-slate-50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mb-3 overflow-hidden">
            {talent.primaryImageUrl ? (
              <img 
                src={talent.primaryImageUrl} 
                alt={talent.titleText}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
              {talent.titleText?.charAt(0) || 'T'}
            </div>
          </div>
          <h3 className="font-semibold text-slate-800 text-sm font-geist mb-1">
            {talent.titleText}
          </h3>
          <p className="text-xs text-slate-600 mb-2">
            {talent.subtitleText}
          </p>
          {talent.detailLine1 && (
            <p className="text-xs text-slate-500">
              {talent.detailLine1}
            </p>
          )}
          {talent.tags && talent.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {talent.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"
                >
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
              {talent.tags.length > 2 && (
                <span className="text-xs text-slate-500">
                  +{talent.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentPreviewCard;
