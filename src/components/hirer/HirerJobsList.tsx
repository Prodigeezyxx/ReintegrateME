
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Briefcase, Plus, RefreshCw, Archive, Trash2 } from 'lucide-react';
import { jobAPI } from '../../services/api';
import { JobPosting } from '../../models/types';

const HirerJobsList = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('active');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  useEffect(() => {
    filterJobs();
  }, [jobs, filter]);
  
  const fetchJobs = async () => {
    try {
      setIsRefreshing(true);
      const data = await jobAPI.getHirerJobs();
      setJobs(data);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job postings",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const filterJobs = () => {
    if (filter === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.status === filter));
    }
  };
  
  const handleRefresh = () => {
    fetchJobs();
  };
  
  const handleFilter = (newFilter: string) => {
    setFilter(newFilter);
  };
  
  const handleCreateJob = () => {
    navigate('/hirer-create-job');
  };
  
  const handleViewJob = (jobId: string) => {
    navigate(`/hirer-job/${jobId}`);
  };
  
  const handleArchiveJob = async (jobId: string) => {
    // In a real app, we would call an API to archive the job
    toast({
      title: "Job archived",
      description: "The job has been archived successfully.",
    });
    
    // Update the local state
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { ...job, status: 'archived' }
          : job
      )
    );
  };
  
  const handleDeleteJob = async (jobId: string) => {
    // In a real app, we would call an API to delete the job
    toast({
      title: "Job deleted",
      description: "The job has been deleted successfully.",
    });
    
    // Update the local state
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };
  
  if (isLoading) {
    return (
      <div className="mobile-container p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading jobs...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Jobs</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => handleFilter('active')}
              className="text-xs h-8"
            >
              Active
            </Button>
            <Button
              variant={filter === 'draft' ? 'default' : 'outline'}
              onClick={() => handleFilter('draft')}
              className="text-xs h-8"
            >
              Drafts
            </Button>
            <Button
              variant={filter === 'archived' ? 'default' : 'outline'}
              onClick={() => handleFilter('archived')}
              className="text-xs h-8"
            >
              Archived
            </Button>
          </div>
        </div>
        
        <Button 
          className="mb-6 bg-reme-orange hover:bg-orange-600 transition-colors"
          onClick={handleCreateJob}
        >
          <Plus className="h-4 w-4 mr-2" /> Post New Job
        </Button>
        
        <div className="space-y-4 mb-6">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No jobs found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filter === 'active' ? "You don't have any active job postings." : 
                   filter === 'draft' ? "You don't have any job drafts." :
                   "You don't have any archived jobs."}
                </p>
                {filter === 'active' || filter === 'draft' ? (
                  <Button 
                    variant="default"
                    className="bg-reme-orange hover:bg-orange-600 transition-colors"
                    onClick={handleCreateJob}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Job Posting
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map(job => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-1">{job.title}</h3>
                      <div className="text-sm text-gray-500 mb-2">
                        {job.companyName} • {job.locationCity}, {job.locationCountry}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded">
                          {job.employmentType}
                        </span>
                        {job.category && (
                          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded">
                            {job.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewJob(job.id)}
                        >
                          View & Edit
                        </Button>
                        {job.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchiveJob(job.id)}
                          >
                            <Archive className="h-3.5 w-3.5 mr-1" /> Archive
                          </Button>
                        )}
                        {job.status === 'draft' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </Button>
                        )}
                      </div>
                    </div>
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

export default HirerJobsList;
