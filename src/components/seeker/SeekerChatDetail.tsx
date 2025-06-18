
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SeekerChatDetail = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [message, setMessage] = useState('');

  // Mock conversation data - in real app this would come from API
  const conversation = {
    id: conversationId,
    company: conversationId === '1' ? 'LogiFlow Ltd' : 'Fresh Eats Restaurant',
    recruiter: conversationId === '1' ? 'Sarah Johnson' : 'Mike Chen',
    avatar: conversationId === '1' ? 'SJ' : 'MC',
    position: conversationId === '1' ? 'Warehouse Assistant' : 'Kitchen Assistant'
  };

  const messages = conversationId === '1' ? [
    {
      id: 1,
      text: "Hi! Thank you for applying to our Warehouse Assistant position. We were impressed with your application.",
      sender: 'employer',
      timestamp: '2:30 PM',
      time: '2 hours ago'
    },
    {
      id: 2,
      text: "We'd like to schedule a phone interview with you. Are you available this Thursday at 2 PM?",
      sender: 'employer',
      timestamp: '2:32 PM',
      time: '2 hours ago'
    },
    {
      id: 3,
      text: "Thank you for your message! Yes, I'm available Thursday at 2 PM. I'm very interested in this opportunity.",
      sender: 'seeker',
      timestamp: '3:15 PM',
      time: '1 hour ago'
    },
    {
      id: 4,
      text: "Perfect! I'll send you the interview details shortly. Looking forward to speaking with you.",
      sender: 'employer',
      timestamp: '3:20 PM',
      time: '1 hour ago'
    }
  ] : [
    {
      id: 1,
      text: "Hello! We received your application for the Kitchen Assistant role. Your background looks interesting.",
      sender: 'employer',
      timestamp: '10:15 AM',
      time: '1 day ago'
    },
    {
      id: 2,
      text: "Would you be available for a brief chat about the role this week?",
      sender: 'employer',
      timestamp: '10:16 AM',
      time: '1 day ago'
    },
    {
      id: 3,
      text: "Hi Mike, thank you for reaching out! I'd be happy to discuss the role. I'm available most days this week.",
      sender: 'seeker',
      timestamp: '11:30 AM',
      time: '1 day ago'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, would send message via API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="mobile-container bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/seeker-messages')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback>{conversation.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">{conversation.company}</h3>
            <p className="text-xs text-gray-500">{conversation.recruiter}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Job Context */}
      <div className="p-4 bg-blue-50 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
          <span className="text-sm font-medium text-blue-800">
            Regarding: {conversation.position}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'seeker' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === 'seeker'
                  ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === 'seeker' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerChatDetail;
