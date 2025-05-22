
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, RefreshCw, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MessageThread {
  id: string;
  recipientName: string;
  recipientImage?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle?: string;
}

const HirerMessages = () => {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchThreads();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredThreads(threads);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredThreads(threads.filter(thread => 
        thread.recipientName.toLowerCase().includes(query) || 
        (thread.jobTitle && thread.jobTitle.toLowerCase().includes(query))
      ));
    }
  }, [threads, searchQuery]);
  
  const fetchThreads = async () => {
    try {
      setIsRefreshing(true);
      
      // In a real app, we would fetch message threads from an API
      // For now, we'll simulate it with mock data
      setTimeout(() => {
        const mockThreads: MessageThread[] = [
          {
            id: '1',
            recipientName: 'John Smith',
            recipientImage: 'https://placehold.co/100x100?text=JS',
            lastMessage: "Thanks for your interest in my profile!",
            timestamp: '10:30 AM',
            unread: true,
            jobTitle: 'Construction Worker'
          },
          {
            id: '2',
            recipientName: 'Emily Johnson',
            recipientImage: 'https://placehold.co/100x100?text=EJ',
            lastMessage: "When would be a good time to discuss the position?",
            timestamp: 'Yesterday',
            unread: false,
            jobTitle: 'Electrician'
          },
          {
            id: '3',
            recipientName: 'Michael Brown',
            lastMessage: "I have 5 years of experience in plumbing.",
            timestamp: '2 days ago',
            unread: false,
            jobTitle: 'Plumber'
          }
        ];
        
        setThreads(mockThreads);
        setFilteredThreads(mockThreads);
        setIsLoading(false);
        setIsRefreshing(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    fetchThreads();
  };
  
  const handleOpenThread = (threadId: string) => {
    // Mark as read
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? { ...thread, unread: false }
          : thread
      )
    );
    
    navigate(`/hirer-messages/${threadId}`);
  };
  
  if (isLoading) {
    return (
      <div className="mobile-container p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reme-orange mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4 mb-6">
          {filteredThreads.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No messages found</h3>
                <p className="text-sm text-gray-500">
                  {searchQuery.trim() !== '' 
                    ? "No messages match your search." 
                    : "You don't have any messages yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredThreads.map(thread => (
              <Card 
                key={thread.id} 
                className={`overflow-hidden cursor-pointer ${thread.unread ? 'bg-blue-50' : ''}`}
                onClick={() => handleOpenThread(thread.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {thread.recipientImage ? (
                        <AvatarImage src={thread.recipientImage} alt={thread.recipientName} />
                      ) : (
                        <AvatarFallback>
                          {thread.recipientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-md font-medium truncate ${thread.unread ? 'text-blue-700' : ''}`}>
                          {thread.recipientName}
                          {thread.unread && <span className="bg-blue-500 rounded-full h-2 w-2 ml-2 inline-block"></span>}
                        </h3>
                        <span className="text-xs text-gray-500">{thread.timestamp}</span>
                      </div>
                      {thread.jobTitle && (
                        <div className="text-xs text-gray-500 mb-1">
                          {thread.jobTitle}
                        </div>
                      )}
                      <p className={`text-sm truncate ${thread.unread ? 'font-medium' : 'text-gray-500'}`}>
                        {thread.lastMessage}
                      </p>
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

export default HirerMessages;
