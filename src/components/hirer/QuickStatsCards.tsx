
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, TrendingUp } from 'lucide-react';

interface QuickStatsCardsProps {
  stats: {
    activeJobs: number;
    profileViews: number;
    responseRate: number;
  };
}

const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <Card className="beautiful-shadow-subtle border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-4 text-center">
          <div className="bg-blue-500 p-2 rounded-xl mb-2 w-fit mx-auto">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <p className="text-xl font-bold text-slate-800 font-geist">{stats.activeJobs}</p>
          <p className="text-xs text-slate-600">Active Jobs</p>
        </CardContent>
      </Card>
      
      <Card className="beautiful-shadow-subtle border-0 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardContent className="p-4 text-center">
          <div className="bg-emerald-500 p-2 rounded-xl mb-2 w-fit mx-auto">
            <Users className="h-4 w-4 text-white" />
          </div>
          <p className="text-xl font-bold text-slate-800 font-geist">{stats.profileViews}</p>
          <p className="text-xs text-slate-600">Profile Views</p>
        </CardContent>
      </Card>
      
      <Card className="beautiful-shadow-subtle border-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-4 text-center">
          <div className="bg-purple-500 p-2 rounded-xl mb-2 w-fit mx-auto">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <p className="text-xl font-bold text-slate-800 font-geist">{stats.responseRate}%</p>
          <p className="text-xs text-slate-600">Response Rate</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsCards;
