
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Users, RefreshCw, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { jobAPI } from '../../services/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface Applicant {
  id: string;
  name: string;
  profileImageUrl?: string;
  applyDate: string;
  status: string;
  jobTitle: string;
  experience?: string;
  skills?: string[];
  location?: string;
}

const HirerApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [jobs, setJobs] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchJobs();
    fetchApplicants();
  }, []);
  
  const fetchJobs = async () => {
    try {
      const data = await jobAPI.getHirerJobs();
      setJobs(data.filter(job => job.status === 'active'));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive"
      });
    }
  };
  
  const fetchApplicants = async () => {
    try {
      setIsRefreshing(true);
      
      // Enhanced mock applicants for better testing experience
      setTimeout(() => {
        const mockApplicants: Applicant[] = [
          {
            id: '1',
            name: 'Marcus Thompson',
            profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            applyDate: '2 hours ago',
            status: 'new',
            jobTitle: 'Construction Worker',
            experience: '5+ years in commercial construction',
            skills: ['Carpentry', 'Safety Compliance', 'Blueprint Reading'],
            location: 'London, UK'
          },
          {
            id: '2',
            name: 'Sarah Mitchell',
            profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            applyDate: '5 hours ago',
            status: 'shortlisted',
            jobTitle: 'Electrician',
            experience: '3 years residential & commercial',
            skills: ['Electrical Systems', 'Wiring', 'Troubleshooting', 'Health & Safety'],
            location: 'Manchester, UK'
          },
          {
            id: '3',
            name: 'David Kumar',
            profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            applyDate: '1 day ago',
            status: 'new',
            jobTitle: 'Construction Worker',
            experience: '8 years heavy construction',
            skills: ['Heavy Machinery', 'Site Management', 'Quality Control'],
            location: 'Birmingham, UK'
          },
          {
            id: '4',
            name: 'Emma Rodriguez',
            profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            applyDate: '1 day ago',
            status: 'rejected',
            jobTitle: 'Plumber',
            experience: '2 years apprenticeship completed',
            skills: ['Pipe Fitting', 'Leak Repair', 'Installation'],
            location: 'Bristol, UK'
          },
          {
            id: '5',
            name: 'James Wilson',
            profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            applyDate: '2 days ago',
            status: 'new',
            jobTitle: 'Delivery Driver',
            experience: 'Clean licence, 4 years logistics',
            skills: ['HGV Licence', 'Navigation', 'Customer Service', 'Time Management'],
            location: 'Leeds, UK'
          },
          {
            id: '6',
            name: 'Lisa Chen',
            profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
            applyDate: '2 days ago',
            status: 'shortlisted',
            jobTitle: 'Electrician',
            experience: 'Certified electrician, 6 years',
            skills: ['Industrial Electrical', 'Motor Controls', 'PLC Programming'],
            location: 'Glasgow, UK'
          },
          {
            id: '7',
            name: 'Robert Taylor',
            profileImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
            applyDate: '3 days ago',
            status: 'new',
            jobTitle: 'Construction Worker',
            experience: 'Recent trade school graduate',
            skills: ['Basic Construction', 'Eager to Learn', 'Reliable'],
            location: 'Sheffield, UK'
          },
          {
            id: '8',
            name: 'Ana Kowalski',
            profileImageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
            applyDate: '3 days ago',
            status: 'new',
            jobTitle: 'Delivery Driver',
            experience: 'Multi-drop delivery specialist',
            skills: ['Route Optimization', 'Customer Relations', 'Van Maintenance'],
            location: 'Liverpool, UK'
          },
          {
            id: '9',
            name: 'Mohammed Ali',
            applyDate: '4 days ago',
            status: 'shortlisted',
            jobTitle: 'Plumber',
            experience: '7 years commercial plumbing',
            skills: ['Commercial Systems', 'Emergency Repairs', 'Team Leadership'],
            location: 'Edinburgh, UK'
          },
          {
            id: '10',
            name: 'Sophie Bennett',
            profileImageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
            applyDate: '5 days ago',
            status: 'new',
            jobTitle: 'Construction Worker',
            experience: 'Specializes in finishing work',
            skills: ['Drywall', 'Painting', 'Flooring', 'Attention to Detail'],
            location: 'Cardiff, UK'
          }
        ];
        
        setApplicants(mockApplicants);
        setIsLoading(false);
        setIsRefreshing(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load applicants",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    fetchApplicants();
  };
  
  const handleFilterByJob = (jobId: string) => {
    setSelectedJobId(jobId);
  };
  
  const filteredApplicants = selectedJobId === 'all' 
    ? applicants 
    : applicants.filter(applicant => applicant.jobTitle === jobs.find(job => job.id === selectedJobId)?.title);
  
  const handleShortlist = (applicantId: string) => {
    setApplicants(prev =>
      prev.map(applicant =>
        applicant.id === applicantId
          ? { ...applicant, status: 'shortlisted' }
          : applicant
      )
    );
    
    toast({
      title: "Applicant shortlisted",
      description: "The applicant has been added to your shortlist."
    });
  };
  
  const handleReject = (applicantId: string) => {
    setApplicants(prev =>
      prev.map(applicant =>
        applicant.id === applicantId
          ? { ...applicant, status: 'rejected' }
          : applicant
      )
    );
    
    toast({
      title: "Applicant rejected",
      description: "The applicant has been marked as rejected."
    });
  };
  
  const handleMessage = (applicantId: string) => {
    navigate(`/hirer-messages/${applicantId}`);
  };
  
  const handleViewProfile = (applicantId: string) => {
    navigate(`/hirer-view-applicant/${applicantId}`);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="mobile-container p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading applicants...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Applicants</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {user?.isGuest && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              👀 <strong>Guest Mode:</strong> These are sample applicants to show you how the platform works
            </p>
          </div>
        )}
        
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex gap-2 min-w-full">
            <Button
              variant={selectedJobId === 'all' ? 'default' : 'outline'}
              onClick={() => handleFilterByJob('all')}
              className="whitespace-nowrap text-xs h-8"
            >
              All Jobs ({filteredApplicants.length})
            </Button>
            
            {jobs.map(job => {
              const jobApplicants = applicants.filter(app => app.jobTitle === job.title);
              return (
                <Button
                  key={job.id}
                  variant={selectedJobId === job.id ? 'default' : 'outline'}
                  onClick={() => handleFilterByJob(job.id)}
                  className="whitespace-nowrap text-xs h-8"
                >
                  {job.title} ({jobApplicants.length})
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {filteredApplicants.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No applicants found</h3>
                <p className="text-sm text-gray-500">
                  {selectedJobId === 'all' 
                    ? "You don't have any applicants yet." 
                    : "No applicants for this job posting."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplicants.map(applicant => (
              <Card key={applicant.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14">
                      {applicant.profileImageUrl ? (
                        <AvatarImage src={applicant.profileImageUrl} alt={applicant.name} />
                      ) : (
                        <AvatarFallback className="bg-reme-orange text-white">
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold mb-1 cursor-pointer hover:text-reme-orange transition-colors"
                        onClick={() => handleViewProfile(applicant.id)}
                      >
                        {applicant.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-1">
                        Applied for <span className="font-medium">{applicant.jobTitle}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {applicant.location} • {applicant.applyDate}
                      </div>
                      {applicant.experience && (
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Experience:</strong> {applicant.experience}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(applicant.status)}`}>
                          {applicant.status === 'new' ? 'New Application' : 
                           applicant.status === 'shortlisted' ? 'Shortlisted' : 
                           applicant.status === 'rejected' ? 'Rejected' : applicant.status}
                        </span>
                      </div>
                      {applicant.skills && applicant.skills.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {applicant.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                            {applicant.skills.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{applicant.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {applicant.status !== 'shortlisted' && applicant.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-700 border-yellow-300 hover:border-yellow-400"
                        onClick={() => handleShortlist(applicant.id)}
                      >
                        <Star className="h-3.5 w-3.5 mr-1" /> Shortlist
                      </Button>
                    )}
                    
                    {applicant.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 border-red-300 hover:border-red-400"
                        onClick={() => handleReject(applicant.id)}
                      >
                        Reject
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessage(applicant.id)}
                      className="hover:bg-blue-50"
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" /> Message
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="ml-auto bg-reme-orange hover:bg-reme-orange/90"
                      onClick={() => handleViewProfile(applicant.id)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HirerApplicants;
