
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
      company: 'LogiFlow Ltd',
      recruiter: 'Sarah Johnson',
      lastMessage: 'Perfect! I\'ll send you the interview details shortly. Looking forward to speaking with you.',
      timestamp: '2 hours ago',
      unread: true,
      avatar: 'SJ',
      position: 'Warehouse Assistant'
    },
    {
      id: 2,
      company: 'Fresh Eats Restaurant',
      recruiter: 'Mike Chen',
      lastMessage: 'Hi Mike, thank you for reaching out! I\'d be happy to discuss the role. I\'m available most days this week.',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'MC',
      position: 'Kitchen Assistant'
    }
  ];

  const handleConversationClick = (conversationId: number) => {
    navigate(`/seeker-messages/${conversationId}`);
  };

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
            <Card 
              key={conversation.id} 
              className="ios-card cursor-pointer hover:shadow-md transition-all duration-200 active:scale-98"
              onClick={() => handleConversationClick(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-orange-100 text-blue-600">
                      {conversation.avatar}
                    </AvatarFallback>
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
                    <p className="text-sm text-blue-600 mb-1">{conversation.position}</p>
                    <p className="text-sm text-gray-600 mb-1">{conversation.recruiter}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    <div className="mt-2 text-xs text-blue-600">
                      Tap to open conversation →
                    </div>
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
