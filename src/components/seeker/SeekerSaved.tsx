
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building2, ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeekerSaved = () => {
  const navigate = useNavigate();

  const savedJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$80,000 - $120,000',
      type: 'Full-time',
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$70,000 - $100,000',
      type: 'Full-time',
      postedDate: '1 week ago'
    }
  ];

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
          <h3 className="text-lg font-semibold mb-2">No Saved Jobs</h3>
          <p className="text-gray-500 mb-6">Jobs you like will appear here for easy access.</p>
          <Button onClick={() => navigate('/seeker-discover')}>
            Discover Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <Card key={job.id} className="ios-card cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      {job.company}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Heart className="h-5 w-5 fill-current" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{job.type}</Badge>
                    <span className="text-sm font-medium text-green-600">{job.salary}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted {job.postedDate}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerSaved;
