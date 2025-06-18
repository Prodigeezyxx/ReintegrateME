
import React from 'react';
import { SwipeableCardData } from '../models/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MapPin, Briefcase, Clock, Award } from 'lucide-react';

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
    <div className="mobile-container bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6 p-6 pb-0">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={onBackClick}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Candidate Profile</h1>
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

        <div className="flex-1 p-6 pt-0 space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100">
                  {seeker.primaryImageUrl ? (
                    <img 
                      src={seeker.primaryImageUrl} 
                      alt={seeker.titleText}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {seeker.titleText.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{seeker.titleText}</h2>
                  <p className="text-blue-600 font-medium">{seeker.subtitleText}</p>
                  {seeker.detailLine1 && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{seeker.detailLine1}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Disclosure Available</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  This candidate has completed full disclosure and is ready to discuss their background openly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Experience */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Skills & Experience
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Core Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {seeker.tags && seeker.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Work Experience</h4>
                  <div className="space-y-3">
                    <div className="border-l-2 border-blue-200 pl-4">
                      <p className="font-medium text-gray-900">Previous Role</p>
                      <p className="text-sm text-gray-600">
                        Experienced professional with skills in {seeker.tags?.slice(0, 2).join(', ')}. 
                        Demonstrated ability to work effectively in team environments.
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        2+ years experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Availability
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Available Now</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{seeker.detailLine1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Work Type</span>
                  <span className="font-medium">Full-time, Part-time</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">About</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Motivated professional with a strong work ethic and commitment to personal growth. 
                Skilled in {seeker.tags?.join(', ')} and eager to contribute to a positive work environment. 
                Available for immediate start and committed to building a stable career.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-white border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onFavoriteToggle}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
            >
              Contact Candidate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileView;
