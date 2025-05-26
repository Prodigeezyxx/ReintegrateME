
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeekerApplications = () => {
  const navigate = useNavigate();

  const applications = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      appliedDate: '2025-01-20',
      status: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      jobTitle: 'React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      appliedDate: '2025-01-18',
      status: 'Interview Scheduled',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      jobTitle: 'Full Stack Engineer',
      company: 'Innovation Labs',
      location: 'New York, NY',
      appliedDate: '2025-01-15',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800'
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
        <h1 className="text-2xl font-bold">My Applications</h1>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
          <p className="text-gray-500 mb-6">Start exploring jobs and apply to find your next opportunity!</p>
          <Button onClick={() => navigate('/seeker-discover')}>
            Discover Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="ios-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      {application.company}
                    </div>
                  </div>
                  <Badge className={application.statusColor}>
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {application.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Applied {application.appliedDate}
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

export default SeekerApplications;
