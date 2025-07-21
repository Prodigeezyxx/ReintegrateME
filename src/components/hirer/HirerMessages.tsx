
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, RefreshCw, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { chatStorage, ChatThread } from '../../utils/chatStorage';

const HirerMessages = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ChatThread[]>([]);
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
        thread.candidateName.toLowerCase().includes(query) || 
        (thread.jobTitle && thread.jobTitle.toLowerCase().includes(query))
      ));
    }
  }, [threads, searchQuery]);
  
  const fetchThreads = async () => {
    try {
      setIsRefreshing(true);
      
      // Get threads from localStorage
      const localThreads = chatStorage.getThreads();
      
      // If no local threads, create some demo data
      if (localThreads.length === 0) {
        const demoThreads: ChatThread[] = [
          {
            id: '1',
            candidateId: '1',
            candidateName: 'John Smith',
            candidateImage: 'https://placehold.co/100x100?text=JS',
            lastMessage: "Thanks for your interest in my profile!",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            unread: true,
            jobTitle: 'Construction Worker',
            messages: []
          },
          {
            id: '2',
            candidateId: '2',
            candidateName: 'Emily Johnson',
            candidateImage: 'https://placehold.co/100x100?text=EJ',
            lastMessage: "When would be a good time to discuss the position?",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            unread: false,
            jobTitle: 'Electrician',
            messages: []
          },
          {
            id: '3',
            candidateId: '3',
            candidateName: 'Michael Brown',
            lastMessage: "I have 5 years of experience in plumbing.",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            unread: false,
            jobTitle: 'Plumber',
            messages: []
          }
        ];
        
        chatStorage.saveThreads(demoThreads);
        setThreads(demoThreads);
      } else {
        setThreads(localThreads);
      }
      
      setIsLoading(false);
      setIsRefreshing(false);
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
    chatStorage.markAsRead(threadId);
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? { ...thread, unread: false }
          : thread
      )
    );
    
    navigate(`/hirer-messages/${threadId}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
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
                      {thread.candidateImage ? (
                        <AvatarImage src={thread.candidateImage} alt={thread.candidateName} />
                      ) : (
                        <AvatarFallback>
                          {thread.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-md font-medium truncate ${thread.unread ? 'text-blue-700' : ''}`}>
                          {thread.candidateName}
                          {thread.unread && <span className="bg-blue-500 rounded-full h-2 w-2 ml-2 inline-block"></span>}
                        </h3>
                        <span className="text-xs text-gray-500">{formatTimestamp(thread.timestamp)}</span>
                      </div>
                      {thread.jobTitle && (
                        <div className="text-xs text-gray-500 mb-1">
                          {thread.jobTitle}
                        </div>
                      )}
                      <p className={`text-sm truncate ${thread.unread ? 'font-medium' : 'text-gray-500'}`}>
                        {thread.lastMessage || 'No messages yet'}
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
