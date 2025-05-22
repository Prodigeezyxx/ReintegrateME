
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Phone, VideoIcon, MoreVertical } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'recipient';
  isRead?: boolean;
}

interface ChatPartner {
  id: string;
  name: string;
  image?: string;
  status?: string;
  jobTitle?: string;
}

const HirerChatDetail = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchChatDetails();
  }, [threadId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchChatDetails = async () => {
    try {
      // In a real app, we would fetch chat details from an API
      // For now, we'll simulate it with mock data
      setTimeout(() => {
        // Mock chat partner
        const mockPartner: ChatPartner = {
          id: '1',
          name: threadId === '1' ? 'John Smith' : threadId === '2' ? 'Emily Johnson' : 'Michael Brown',
          image: threadId === '1' ? 'https://placehold.co/100x100?text=JS' : 
                 threadId === '2' ? 'https://placehold.co/100x100?text=EJ' : undefined,
          status: 'online',
          jobTitle: threadId === '1' ? 'Construction Worker' : 
                    threadId === '2' ? 'Electrician' : 'Plumber',
        };
        
        setChatPartner(mockPartner);
        
        // Mock messages
        const mockMessages: Message[] = [];
        
        // Generate a conversation with 5-10 messages
        const messageCount = Math.floor(Math.random() * 6) + 5;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        for (let i = 0; i < messageCount; i++) {
          const isUser = i % 2 === 0;
          const hour = Math.floor(Math.random() * 12) + 1;
          const minute = Math.floor(Math.random() * 60);
          const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
          
          mockMessages.push({
            id: `msg-${i}`,
            text: isUser ? 
              "Thank you for your interest in the position. Could you tell me more about your experience?" :
              "I have 5 years of experience in the field, working on various projects.",
            timestamp: i === messageCount - 1 ? 
              `${hour}:${minute < 10 ? '0' + minute : minute} ${ampm}` : 
              `Yesterday, ${hour}:${minute < 10 ? '0' + minute : minute} ${ampm}`,
            sender: isUser ? 'user' : 'recipient',
            isRead: true
          });
        }
        
        // Add two more messages for demo
        mockMessages.push({
          id: `msg-${messageCount}`,
          text: "Do you have any certifications related to the job?",
          timestamp: "10:15 AM",
          sender: 'user',
          isRead: true
        });
        
        mockMessages.push({
          id: `msg-${messageCount + 1}`,
          text: "Yes, I'm certified in workplace safety and have completed several professional training courses.",
          timestamp: "10:30 AM",
          sender: 'recipient',
          isRead: false
        });
        
        setMessages(mockMessages);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load conversation.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };
  
  const formatDay = (timestamp: string) => {
    if (timestamp.includes('Yesterday')) return 'Yesterday';
    return timestamp.split(',')[0];
  };
  
  const formatTime = (timestamp: string) => {
    if (timestamp.includes('Yesterday')) {
      return timestamp.split(', ')[1];
    }
    return timestamp;
  };
  
  // Group messages by day
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    const day = formatDay(message.timestamp);
    if (!groupedMessages[day]) {
      groupedMessages[day] = [];
    }
    groupedMessages[day].push(message);
  });
  
  if (isLoading || !chatPartner) {
    return (
      <div className="mobile-container flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mobile-container flex flex-col h-screen bg-gray-50">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="mr-2" 
          onClick={() => navigate('/hirer-messages')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10 mr-3">
          {chatPartner.image ? (
            <AvatarImage src={chatPartner.image} alt={chatPartner.name} />
          ) : (
            <AvatarFallback>
              {chatPartner.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{chatPartner.name}</h2>
          <div className="text-xs text-gray-500">
            {chatPartner.status === 'online' && (
              <span className="flex items-center">
                <span className="bg-green-500 rounded-full h-2 w-2 mr-1"></span>
                Online
              </span>
            )}
            {chatPartner.jobTitle && !chatPartner.status && (
              <span>{chatPartner.jobTitle}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <VideoIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(groupedMessages).map((day, index) => (
          <div key={day} className="mb-5">
            <div className="flex justify-center mb-4">
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                {day}
              </span>
            </div>
            
            <div className="space-y-3">
              {groupedMessages[day].map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-reme-orange text-white' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div 
                      className={`text-right text-xs mt-1 ${
                        message.sender === 'user' 
                          ? 'text-orange-100' 
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                      {message.sender === 'user' && (
                        <span className="ml-1">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center">
          <Input
            className="flex-1 mr-2"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            variant="default"
            size="icon"
            className="bg-reme-orange hover:bg-orange-600"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HirerChatDetail;
