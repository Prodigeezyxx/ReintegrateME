
import React from 'react';
import { SwipeableCardData } from '../models/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart } from 'lucide-react';

interface SeekerProfileViewProps {
  seeker: SwipeableCardData;
  onBackClick: () => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const SeekerProfileView: React.FC<SeekerProfileViewProps> = ({ 
  seeker, 
  onBackClick, 
  isFavorite, 
  onFavoriteToggle 
}) => {
  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={onBackClick}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Talent Profile</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onFavoriteToggle}
            className={isFavorite ? "text-red-500" : ""}
          >
            <Heart className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
              {seeker.primaryImageUrl ? (
                <img 
                  src={seeker.primaryImageUrl} 
                  alt={seeker.titleText}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {seeker.titleText.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{seeker.titleText}</h2>
              <p className="text-gray-500">{seeker.subtitleText}</p>
            </div>
          </CardHeader>
          <CardContent>
            {seeker.detailLine1 && (
              <p className="mb-2 flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {seeker.detailLine1}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Skills</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {seeker.tags && seeker.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Experience</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Experienced professional with skills in {seeker.tags?.join(', ')}. 
              Available for immediate start in {seeker.detailLine1}.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-auto mb-4">
          <Button 
            variant="default" 
            className="flex-1 bg-reme-orange hover:bg-orange-600"
          >
            Contact
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onFavoriteToggle}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileView;
