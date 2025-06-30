
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { SwipeableCardData } from '../../models/types';
import TalentPreviewCard from './TalentPreviewCard';

interface TalentDiscoverySectionProps {
  talentPreviews: SwipeableCardData[];
  isTalentLoading: boolean;
  onTalentPreviewClick: (talent: SwipeableCardData) => void;
}

const TalentDiscoverySection: React.FC<TalentDiscoverySectionProps> = ({
  talentPreviews,
  isTalentLoading,
  onTalentPreviewClick
}) => {
  return (
    <>
      {/* Main Talent Discovery Section */}
      <Card className="mb-6 beautiful-shadow border-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <CardHeader className="px-4 pt-6 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-geist text-slate-800 mb-1">Discover Top Talent</CardTitle>
              <CardDescription className="text-slate-600">Find the perfect candidates for your roles</CardDescription>
            </div>
            <div className="bg-orange-100 p-2 rounded-xl">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-6">
          {isTalentLoading ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[200px] h-32 bg-slate-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : talentPreviews.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {talentPreviews.map((talent) => (
                <TalentPreviewCard
                  key={talent.id}
                  talent={talent}
                  onClick={() => onTalentPreviewClick(talent)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-600 mb-4 font-geist">No talent profiles available at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prominent Browse Talent Button */}
      <div className="mb-8">
        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white beautiful-shadow transition-all duration-200 font-geist font-bold text-xl py-8 h-auto"
          asChild
        >
          <Link to="/hirer-discover" className="flex items-center justify-center gap-3">
            <Users className="h-6 w-6" />
            Browse All Talent
            <ArrowRight className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default TalentDiscoverySection;
