
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Users, RefreshCw, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { jobAPI } from '../../services/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SortDropdown, SortOption } from '../ui/sort-dropdown';
import CandidateProfileView from './CandidateProfileView';

interface Applicant {
  id: string;
  name: string;
  profileImageUrl?: string;
  applyDate: string;
  status: string;
  jobTitle: string;
}

const HirerApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [sortBy, setSortBy] = useState('status_priority');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sortOptions: SortOption[] = [
    { value: 'status_priority', label: 'Status (New First)' },
    { value: 'date_desc', label: 'Date (Newest First)' },
    { value: 'date_asc', label: 'Date (Oldest First)' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'job_title_asc', label: 'Job Title (A-Z)' }
  ];
  
  useEffect(() => {
    fetchJobs();
    fetchApplicants();
    
    // Load saved sort preference
    const savedSort = localStorage.getItem('hirer_applicants_sort');
    if (savedSort) {
      setSortBy(savedSort);
    }
    
    // Check for filter parameter from dashboard navigation
    const filter = searchParams.get('filter');
    if (filter === 'new') {
      console.log('Filtering to new applicants');
    }
  }, [searchParams]);
  
  useEffect(() => {
    filterAndSortApplicants();
  }, [applicants, selectedJobId, sortBy]);
  
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
      
      // Mock applicants data with different dates for sorting
      setTimeout(() => {
        const mockApplicants: Applicant[] = [
          {
            id: '1',
            name: 'John Smith',
            profileImageUrl: 'https://placehold.co/100x100?text=JS',
            applyDate: '2 days ago',
            status: 'new',
            jobTitle: 'Construction Worker'
          },
          {
            id: '2',
            name: 'Emily Johnson',
            profileImageUrl: 'https://placehold.co/100x100?text=EJ',
            applyDate: '1 week ago',
            status: 'shortlisted',
            jobTitle: 'Electrician'
          },
          {
            id: '3',
            name: 'Michael Brown',
            applyDate: '3 days ago',
            status: 'new',
            jobTitle: 'Construction Worker'
          },
          {
            id: '4',
            name: 'Lisa Anderson',
            profileImageUrl: 'https://placehold.co/100x100?text=LA',
            applyDate: '4 days ago',
            status: 'rejected',
            jobTitle: 'Plumber'
          },
          {
            id: '5',
            name: 'David Wilson',
            applyDate: '5 days ago',
            status: 'new',
            jobTitle: 'Construction Worker'
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
  
  const filterAndSortApplicants = () => {
    let filtered = applicants;
    
    // Apply job filter
    if (selectedJobId !== 'all') {
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      if (selectedJob) {
        filtered = applicants.filter(applicant => applicant.jobTitle === selectedJob.title);
      }
    }
    
    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'status_priority':
          const statusOrder = { 'new': 0, 'shortlisted': 1, 'rejected': 2 };
          const statusDiff = (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
          // If same status, sort by date
          if (statusDiff === 0) {
            return getDateValue(b.applyDate) - getDateValue(a.applyDate);
          }
          return statusDiff;
        case 'date_desc':
          return getDateValue(b.applyDate) - getDateValue(a.applyDate);
        case 'date_asc':
          return getDateValue(a.applyDate) - getDateValue(b.applyDate);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'job_title_asc':
          return a.jobTitle.localeCompare(b.jobTitle);
        default:
          return 0;
      }
    });
    
    setFilteredApplicants(sorted);
  };
  
  const getDateValue = (dateString: string): number => {
    // Convert relative date strings to timestamps for sorting
    const now = Date.now();
    if (dateString.includes('day')) {
      const days = parseInt(dateString);
      return now - (days * 24 * 60 * 60 * 1000);
    } else if (dateString.includes('week')) {
      const weeks = parseInt(dateString);
      return now - (weeks * 7 * 24 * 60 * 60 * 1000);
    } else if (dateString.includes('hour')) {
      const hours = parseInt(dateString);
      return now - (hours * 60 * 60 * 1000);
    }
    return now;
  };
  
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    localStorage.setItem('hirer_applicants_sort', newSort);
  };
  
  const handleRefresh = () => {
    fetchApplicants();
  };
  
  const handleFilterByJob = (jobId: string) => {
    setSelectedJobId(jobId);
  };
  
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
  
  const handleViewProfile = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
  };
  
  const mockApplicantToCandidate = (applicant: Applicant) => ({
    id: applicant.id,
    type: 'seeker' as const,
    titleText: applicant.name,
    subtitleText: applicant.jobTitle,
    detailLine1: 'London, UK',
    detailLine2: 'Experienced professional with strong background in construction and safety management.',
    primaryImageUrl: applicant.profileImageUrl,
    tags: ['Construction', 'Safety', 'Team Leadership']
  });
  
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
  
  if (selectedApplicant) {
    return (
      <CandidateProfileView
        candidate={mockApplicantToCandidate(selectedApplicant)}
        onBackClick={() => setSelectedApplicant(null)}
        showContactButton={true}
      />
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
          <div className="flex gap-2">
            <SortDropdown
              options={sortOptions}
              value={sortBy}
              onValueChange={handleSortChange}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex gap-2 min-w-full">
            <Button
              variant={selectedJobId === 'all' ? 'default' : 'outline'}
              onClick={() => handleFilterByJob('all')}
              className="whitespace-nowrap text-xs h-8"
            >
              All Jobs
            </Button>
            
            {jobs.map(job => (
              <Button
                key={job.id}
                variant={selectedJobId === job.id ? 'default' : 'outline'}
                onClick={() => handleFilterByJob(job.id)}
                className="whitespace-nowrap text-xs h-8"
              >
                {job.title}
              </Button>
            ))}
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
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {applicant.profileImageUrl ? (
                        <AvatarImage src={applicant.profileImageUrl} alt={applicant.name} />
                      ) : (
                        <AvatarFallback>
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h3 
                        className="text-md font-medium mb-0.5 cursor-pointer hover:text-reme-orange transition-colors"
                        onClick={() => handleViewProfile(applicant)}
                      >
                        {applicant.name}
                      </h3>
                      <div className="text-xs text-gray-500 mb-1">
                        Applied for {applicant.jobTitle} • {applicant.applyDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeClass(applicant.status)}`}>
                          {applicant.status === 'new' ? 'New' : 
                           applicant.status === 'shortlisted' ? 'Shortlisted' : 
                           applicant.status === 'rejected' ? 'Rejected' : applicant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {applicant.status !== 'shortlisted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => handleShortlist(applicant.id)}
                      >
                        <Star className="h-3.5 w-3.5 mr-1" /> Shortlist
                      </Button>
                    )}
                    
                    {applicant.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleReject(applicant.id)}
                      >
                        Reject
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessage(applicant.id)}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" /> Message
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleViewProfile(applicant)}
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
