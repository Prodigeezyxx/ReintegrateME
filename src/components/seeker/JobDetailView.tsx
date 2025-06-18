
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Clock, Building2, DollarSign, Users, Calendar, Heart, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface JobDetailViewProps {
  job: {
    id: number;
    jobTitle: string;
    company: string;
    location: string;
    appliedDate?: string;
    status?: string;
    statusColor?: string;
    salary?: string;
    employmentType?: string;
    description?: string;
    requirements?: string[];
    benefits?: string[];
  };
  onBackClick: () => void;
  showApplicationStatus?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  showApplyButton?: boolean;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ 
  job, 
  onBackClick, 
  showApplicationStatus = false,
  isFavorite = false,
  onFavoriteToggle,
  showApplyButton = false
}) => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');

  const handleContactEmployer = () => {
    setContactSubject(`Inquiry about ${job.jobTitle} position`);
    setContactMessage(`Dear ${job.company} Hiring Team,

I am writing to express my interest in the ${job.jobTitle} position. I would like to learn more about this opportunity and discuss how my skills and experience could benefit your team.

Thank you for your time and consideration.

Best regards`);
    setIsContactModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in both subject and message.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the message via API
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${job.company}.`,
    });
    
    setIsContactModalOpen(false);
    setContactMessage('');
    setContactSubject('');
  };

  return (
    <div className="mobile-container bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6 p-6 pb-0">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={onBackClick}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Job Details</h1>
          </div>
          {onFavoriteToggle && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onFavoriteToggle}
            >
              <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
        </div>

        <div className="flex-1 p-6 pt-0 space-y-6">
          {/* Job Header */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h2>
                  <p className="text-blue-600 font-medium">{job.company}</p>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                </div>
              </div>
              
              {showApplicationStatus && job.status && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">
                        Application Status
                      </span>
                    </div>
                    <Badge className={job.statusColor}>
                      {job.status}
                    </Badge>
                  </div>
                  {job.appliedDate && (
                    <p className="text-xs text-blue-700 mt-1">
                      Applied on {job.appliedDate}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="font-medium">{job.employmentType || 'Full-time'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{job.salary || '£25,000 - £35,000'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Experience Level</p>
                    <p className="font-medium">Entry to Mid-level</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Remote Work</p>
                    <p className="font-medium">On-site</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {job.description || `We are looking for a dedicated ${job.jobTitle} to join our team at ${job.company}. This is an excellent opportunity for someone looking to build their career in a supportive environment. You'll work alongside experienced professionals and have opportunities for growth and development.`}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>What we're looking for</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(job.requirements || [
                  'Reliable and punctual',
                  'Ability to work in a team',
                  'Good communication skills',
                  'Willingness to learn',
                  'Physical fitness for the role'
                ]).map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>What we offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {(job.benefits || [
                  'Competitive salary',
                  'Health insurance',
                  'Paid time off',
                  'Training and development',
                  'Supportive work environment'
                ]).map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-white border-t">
          <div className="flex gap-3">
            {!showApplicationStatus ? (
              <>
                {onFavoriteToggle && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={onFavoriteToggle}
                  >
                    {isFavorite ? 'Remove from Saved' : 'Save Job'}
                  </Button>
                )}
                {showApplyButton && (
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                    Apply Now
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" className="flex-1">
                  Withdraw Application
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                  onClick={handleContactEmployer}
                >
                  Contact Employer
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Employer Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {job.company}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Enter subject..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsContactModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetailView;
