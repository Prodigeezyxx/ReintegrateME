
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeekerMessages = () => {
  const navigate = useNavigate();

  const conversations = [
    {
      id: 1,
      company: 'TechCorp Inc.',
      recruiter: 'Sarah Johnson',
      lastMessage: 'Thanks for your application! We\'d like to schedule an interview.',
      timestamp: '2 hours ago',
      unread: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      company: 'StartupXYZ',
      recruiter: 'Mike Chen',
      lastMessage: 'Your portfolio looks impressive. Let\'s discuss the role further.',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'MC'
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
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
          <p className="text-gray-500 mb-6">When employers are interested in your profile, they'll message you here.</p>
          <Button onClick={() => navigate('/seeker-discover')}>
            Discover Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="ios-card cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback>{conversation.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">{conversation.company}</h3>
                        {conversation.unread && (
                          <Badge variant="destructive" className="h-2 w-2 p-0"></Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{conversation.recruiter}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
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

export default SeekerMessages;
