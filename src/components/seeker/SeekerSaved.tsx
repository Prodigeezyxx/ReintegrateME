
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Building2, Heart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SwipeableCardData } from '../../models/types';
import { toast } from '@/hooks/use-toast';

const SeekerSaved = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SwipeableCardData[]>([]);

  useEffect(() => {
    // Load saved jobs from localStorage
    const saved = localStorage.getItem('seekerFavorites');
    if (saved) {
      try {
        setSavedJobs(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved jobs', error);
      }
    }
  }, []);

  const handleRemoveJob = (jobId: string) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
    localStorage.setItem('seekerFavorites', JSON.stringify(updatedJobs));
    
    toast({
      title: "Job Removed",
      description: "Job has been removed from your saved list.",
    });
  };

  const handleApplyToJob = (job: SwipeableCardData) => {
    toast({
      title: "Application Started",
      description: `Application process started for ${job.titleText}`,
    });
    // Here you would typically navigate to an application form or process
  };

  return (
    <div className="mobile-container p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/seeker-dashboard')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Saved Jobs Yet</h3>
          <p className="text-gray-500 mb-6">Jobs you like will appear here. Start exploring to find opportunities you love!</p>
          <Button onClick={() => navigate('/seeker-discover')}>
            Discover Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <Card key={job.id} className="ios-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg pr-2">{job.titleText}</CardTitle>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      {job.subtitleText}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveJob(job.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {job.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.detailLine1 || 'Location not specified'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted recently
                  </div>
                </div>

                <Button 
                  onClick={() => handleApplyToJob(job)}
                  className="w-full bg-reme-orange hover:bg-orange-600"
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerSaved;
