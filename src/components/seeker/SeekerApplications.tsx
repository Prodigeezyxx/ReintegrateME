import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Building2, ArrowLeft, Trash2, Filter, SortAsc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import JobDetailView from './JobDetailView';

const SeekerApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applications, setApplications] = useState([
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
  ]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter(app => {
      if (statusFilter === 'all') return true;
      return app.status === statusFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'date-asc':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case 'company':
          return a.company.localeCompare(b.company);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, statusFilter, sortBy]);

  const handleDeleteApplication = (applicationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setApplications(prev => prev.filter(app => app.id !== applicationId));
    toast({
      title: "Application removed",
      description: "The application has been removed from your list.",
    });
  };

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
    <div className="mobile-container p-6 pb-20 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/seeker-dashboard')}
          className="mr-2 hover:bg-slate-100 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-geist">My Applications</h1>
          <p className="text-sm text-slate-600 font-geist">Manage your job applications</p>
        </div>
      </div>

      {/* Compact Filter and Sort Controls */}
      <div className="mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4">
          {/* Status Filter Chips */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700 font-geist">Filter by Status</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] h-8 bg-white/50 border-slate-200 text-xs font-geist">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="date-desc" className="font-geist text-xs">Newest First</SelectItem>
                  <SelectItem value="date-asc" className="font-geist text-xs">Oldest First</SelectItem>
                  <SelectItem value="company" className="font-geist text-xs">Company A-Z</SelectItem>
                  <SelectItem value="status" className="font-geist text-xs">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: 'all', label: 'All Applications', count: applications.length },
                { value: 'Under Review', label: 'Under Review', count: applications.filter(a => a.status === 'Under Review').length },
                { value: 'Interview Scheduled', label: 'Interview Scheduled', count: applications.filter(a => a.status === 'Interview Scheduled').length },
                { value: 'Not Selected', label: 'Not Selected', count: applications.filter(a => a.status === 'Not Selected').length }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 font-geist ${
                    statusFilter === option.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredAndSortedApplications.length === 0 && applications.length > 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 font-geist text-slate-800">No applications match your filters</h3>
          <p className="text-slate-600 mb-6 font-geist">Try adjusting your filter criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => setStatusFilter('all')}
            className="font-geist hover:bg-slate-50"
          >
            Clear Filters
          </Button>
        </div>
      ) : filteredAndSortedApplications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 font-geist text-slate-800">No Applications Yet</h3>
          <p className="text-slate-600 mb-6 font-geist">Start exploring jobs and apply to find your next opportunity!</p>
          <Button 
            onClick={() => navigate('/seeker-discover')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-geist"
          >
            Discover Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedApplications.map((application) => (
            <Card 
              key={application.id} 
              className="ios-card cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-98 bg-white border-slate-200/50"
              onClick={() => handleApplicationClick(application)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-geist text-slate-800">{application.jobTitle}</CardTitle>
                    <div className="flex items-center text-slate-600 text-sm mt-1 font-geist">
                      <Building2 className="h-4 w-4 mr-1" />
                      {application.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${application.statusColor} font-geist`}>
                      {application.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      onClick={(e) => handleDeleteApplication(application.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-slate-500 font-geist">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {application.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Applied {application.appliedDate}
                  </div>
                </div>
                <div className="mt-2 text-xs text-indigo-600 font-geist font-medium">
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
