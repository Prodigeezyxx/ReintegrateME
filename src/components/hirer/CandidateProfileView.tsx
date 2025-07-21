import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Heart, MessageSquare, MapPin, Briefcase, Star, CheckCircle } from 'lucide-react';
import { SwipeableCardData } from '../../models/types';
import { chatStorage } from '../../utils/chatStorage';

interface CandidateProfileViewProps {
  candidate: SwipeableCardData;
  onBackClick: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  showContactButton?: boolean;
}

const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({
  candidate,
  onBackClick,
  isFavorite = false,
  onFavoriteToggle,
  showContactButton = true
}) => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const handleContactCandidate = () => {
    setIsContactModalOpen(true);
  };

  const handleSendMessage = () => {
    if (contactMessage.trim()) {
      // Create or find existing chat thread
      const existingThreads = chatStorage.getThreads();
      let thread = existingThreads.find(t => t.candidateId === candidate.id);
      
      if (!thread) {
        // Create new thread
        thread = chatStorage.createThread(
          candidate.id,
          candidate.titleText,
          candidate.primaryImageUrl,
          candidate.subtitleText
        );
        
        const allThreads = [thread, ...existingThreads];
        chatStorage.saveThreads(allThreads);
      }
      
      // Add the message to the thread
      chatStorage.addMessage(thread.id, {
        senderId: 'current-hirer',
        senderName: 'You',
        content: contactMessage,
        timestamp: new Date(),
        isFromHirer: true
      });
      
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${candidate.titleText}.`,
      });
      
      setIsContactModalOpen(false);
      setContactMessage('');
      navigate('/hirer-messages');
    }
  };

  const mockCandidateDetails = {
    workPreferences: ['Full-time', 'On-site work', 'Flexible hours'],
    availability: 'Available immediately',
    experience: '5+ years in construction',
    keySkills: candidate.tags || ['Construction', 'Safety Management', 'Team Leadership'],
    disclosureStatus: 'Disclosure available',
    location: candidate.detailLine1 || 'London, UK',
    lastActive: '2 days ago'
  };

  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            {onFavoriteToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFavoriteToggle}
                className={isFavorite ? 'text-red-500' : 'text-gray-500'}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                {candidate.primaryImageUrl ? (
                  <AvatarImage src={candidate.primaryImageUrl} alt={candidate.titleText} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {candidate.titleText.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{candidate.titleText}</h1>
                {candidate.subtitleText && (
                  <p className="text-gray-600 mb-2">{candidate.subtitleText}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{mockCandidateDetails.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {mockCandidateDetails.disclosureStatus}
                  </div>
                  <span className="text-xs text-gray-500">{mockCandidateDetails.lastActive}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Briefcase className="h-6 w-6 text-reme-orange mx-auto mb-2" />
              <p className="text-sm font-medium">Experience</p>
              <p className="text-xs text-gray-500">5+ years</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Rating</p>
              <p className="text-xs text-gray-500">4.8/5</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Availability</p>
              <p className="text-xs text-gray-500">Immediate</p>
            </CardContent>
          </Card>
        </div>

        {/* Key Skills */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Key Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockCandidateDetails.keySkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Work Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockCandidateDetails.workPreferences.map((preference, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{preference}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {candidate.detailLine2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{candidate.detailLine2}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact Button */}
        {showContactButton && (
          <div className="mt-auto mb-6">
            <Button 
              onClick={handleContactCandidate}
              className="w-full bg-reme-orange hover:bg-orange-600 transition-colors"
              size="lg"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Candidate
            </Button>
          </div>
        )}

        {/* Contact Modal */}
        {isContactModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Contact {candidate.titleText}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  className="w-full h-32 p-3 border rounded-lg resize-none"
                  placeholder="Write your message here..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsContactModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    className="flex-1 bg-reme-orange hover:bg-orange-600"
                    disabled={!contactMessage.trim()}
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfileView;
