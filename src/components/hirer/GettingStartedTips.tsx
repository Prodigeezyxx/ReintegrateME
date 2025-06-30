
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, TrendingUp } from 'lucide-react';

const GettingStartedTips: React.FC = () => {
  return (
    <Card className="mb-8 beautiful-shadow border-0">
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-lg font-geist text-slate-800">Getting Started Tips</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-lg mt-0.5">
              <Briefcase className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Post your first job</p>
              <p className="text-xs text-slate-600">Create detailed job postings to attract the right candidates</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-1.5 rounded-lg mt-0.5">
              <Users className="h-3 w-3 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Browse talent profiles</p>
              <p className="text-xs text-slate-600">Use our swipe feature to discover candidates that match your needs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-1.5 rounded-lg mt-0.5">
              <TrendingUp className="h-3 w-3 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Optimize your company profile</p>
              <p className="text-xs text-slate-600">Complete your profile to attract more quality applications</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GettingStartedTips;
