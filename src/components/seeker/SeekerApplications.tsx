
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobDetailView from './JobDetailView';

const SeekerApplications = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const applications = [
    {
      id: 1,
      jobTitle: 'Warehouse Assistant',
      company: 'LogiFlow Ltd',
      location: 'Manchester, UK',
      appliedDate: '2025-01-20',
      status: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800',
      salary: '£22,000 - £26,000',
      employmentType: 'Full-time',
      description: 'Join our busy warehouse team where you\'ll be responsible for picking, packing, and dispatching goods. We offer full training and a supportive team environment.',
      requirements: [
        'Previous warehouse experience preferred',
        'Ability to lift up to 25kg',
        'Good attention to detail',
        'Reliable and punctual',
        'Team player with positive attitude'
      ],
      benefits: [
        '25 days holiday plus bank holidays',
        'Company pension scheme',
        'Free parking',
        'Staff discounts',
        'Career progression opportunities'
      ]
    },
    {
      id: 2,
      jobTitle: 'Kitchen Assistant',
      company: 'Fresh Eats Restaurant',
      location: 'Birmingham, UK',
      appliedDate: '2025-01-18',
      status: 'Interview Scheduled',
      statusColor: 'bg-blue-100 text-blue-800',
      salary: '£20,000 - £23,000',
      employmentType: 'Full-time',
      description: 'We\'re looking for a reliable kitchen assistant to join our busy restaurant kitchen. You\'ll help with food preparation, cleaning, and ensuring our kitchen runs smoothly.',
      requirements: [
        'Food hygiene certificate (can be obtained)',
        'Ability to work in fast-paced environment',
        'Good communication skills',
        'Flexible with working hours',
        'Previous kitchen experience helpful but not essential'
      ],
      benefits: [
        'Flexible working hours',
        'Staff meals provided',
        'Training provided',
        'Friendly team environment',
        'Tips sharing scheme'
      ]
    },
    {
      id: 3,
      jobTitle: 'Retail Assistant',
      company: 'City Store',
      location: 'Leeds, UK',
      appliedDate: '2025-01-15',
      status: 'Not Selected',
      statusColor: 'bg-red-100 text-red-800',
      salary: '£19,500 - £22,000',
      employmentType: 'Part-time',
      description: 'Customer-focused retail assistant role in our busy city center store. You\'ll help customers, handle transactions, and maintain store presentation.',
      requirements: [
        'Excellent customer service skills',
        'Cash handling experience preferred',
        'Good communication skills',
        'Ability to work weekends',
        'Retail experience preferred'
      ],
      benefits: [
        'Staff discount',
        'Flexible hours',
        'Training provided',
        'Career development',
        'Supportive management'
      ]
    }
  ];

  const handleApplicationClick = (application: any) => {
    setSelectedJob(application);
  };

  if (selectedJob) {
    return (
      <JobDetailView 
        job={selectedJob} 
        onBackClick={() => setSelectedJob(null)}
        showApplicationStatus={true}
      />
    );
  }

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
            <Card 
              key={application.id} 
              className="ios-card cursor-pointer hover:shadow-md transition-all duration-200 active:scale-98"
              onClick={() => handleApplicationClick(application)}
            >
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
                <div className="mt-2 text-xs text-blue-600">
                  Tap to view details →
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
