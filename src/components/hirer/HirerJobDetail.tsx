
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Archive, Trash2, Users, Eye } from 'lucide-react';
import { jobAPI } from '../../services/api';
import { JobPosting } from '../../models/types';

const HirerJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicantsCount, setApplicantsCount] = useState(0);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      // In a real app, we would fetch the specific job details
      // For now, we'll mock it
      const jobs = await jobAPI.getHirerJobs();
      const foundJob = jobs.find(j => j.id === jobId);
      
      if (foundJob) {
        setJob(foundJob);
        // Mock applicants count
        setApplicantsCount(Math.floor(Math.random() * 20) + 5);
      } else {
        toast({
          title: "Job not found",
          description: "The job posting you're looking for doesn't exist.",
          variant: "destructive"
        });
        navigate('/hirer-jobs');
      }
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleEditJob = () => {
    navigate(`/hirer-edit-job/${jobId}`);
  };

  const handleViewApplicants = () => {
    navigate(`/hirer-applicants?job=${jobId}`);
  };

  const handleArchiveJob = async () => {
    toast({
      title: "Job archived",
      description: "The job has been archived successfully.",
    });
    navigate('/hirer-jobs');
  };

  const handleDeleteJob = async () => {
    toast({
      title: "Job deleted",
      description: "The job has been deleted successfully.",
    });
    navigate('/hirer-jobs');
  };

  if (isLoading) {
    return (
      <div className="mobile-container p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mobile-container p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Job not found</h3>
          <p className="text-gray-500 mb-4">The job posting you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/hirer-jobs')}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditJob}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Job Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                <p className="text-gray-600">{job.companyName}</p>
                <p className="text-sm text-gray-500">{job.locationCity}, {job.locationCountry}</p>
              </div>
              <Badge 
                variant={job.status === 'active' ? 'default' : 'secondary'}
                className={job.status === 'active' ? 'bg-green-500' : ''}
              >
                {job.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewApplicants}>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xl font-bold">{applicantsCount}</p>
              <p className="text-xs text-gray-500">Applicants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-xl font-bold">{Math.floor(Math.random() * 100) + 50}</p>
              <p className="text-xs text-gray-500">Views</p>
            </CardContent>
          </Card>
        </div>

        {/* Job Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Employment Type</h4>
              <Badge variant="outline">{job.employmentType}</Badge>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Category</h4>
              <Badge variant="outline">{job.category}</Badge>
            </div>
            
            {job.experienceLevel && (
              <div>
                <h4 className="font-medium mb-2">Experience Level</h4>
                <Badge variant="outline">{job.experienceLevel}</Badge>
              </div>
            )}
            
            {job.salary && (job.salary.min || job.salary.max) && (
              <div>
                <h4 className="font-medium mb-2">Salary Range</h4>
                <p className="text-gray-700">
                  {job.salary.min && job.salary.max ? 
                    `£${job.salary.min.toLocaleString()} - £${job.salary.max.toLocaleString()}` :
                    job.salary.min ? `£${job.salary.min.toLocaleString()}+` :
                    `Up to £${job.salary.max?.toLocaleString()}`
                  } annual
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </CardContent>
        </Card>

        {/* Required Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto mb-6">
          <Button 
            onClick={handleViewApplicants}
            className="w-full bg-reme-orange hover:bg-orange-600"
            size="lg"
          >
            <Users className="h-5 w-5 mr-2" />
            View Applicants ({applicantsCount})
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleEditJob}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
            
            {job.status === 'active' ? (
              <Button
                variant="outline"
                onClick={handleArchiveJob}
                className="flex-1"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleDeleteJob}
                className="flex-1 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HirerJobDetail;
