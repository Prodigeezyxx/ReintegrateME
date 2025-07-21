
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isFromHirer: boolean;
}

export interface ChatThread {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateImage?: string;
  jobTitle?: string;
  messages: ChatMessage[];
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const CHAT_STORAGE_KEY = 'hirer_chat_threads';

export const chatStorage = {
  getThreads: (): ChatThread[] => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading chat threads:', error);
      return [];
    }
  },

  saveThreads: (threads: ChatThread[]): void => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(threads));
    } catch (error) {
      console.error('Error saving chat threads:', error);
    }
  },

  createThread: (candidateId: string, candidateName: string, candidateImage?: string, jobTitle?: string): ChatThread => {
    const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: threadId,
      candidateId,
      candidateName,
      candidateImage,
      jobTitle,
      messages: [],
      lastMessage: '',
      timestamp: new Date().toISOString(),
      unread: false
    };
  },

  addMessage: (threadId: string, message: Omit<ChatMessage, 'id'>): void => {
    const threads = chatStorage.getThreads();
    const threadIndex = threads.findIndex(t => t.id === threadId);
    
    if (threadIndex !== -1) {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      threads[threadIndex].messages.push(newMessage);
      threads[threadIndex].lastMessage = message.content;
      threads[threadIndex].timestamp = new Date().toISOString();
      threads[threadIndex].unread = !message.isFromHirer;
      
      chatStorage.saveThreads(threads);
    }
  },

  getThread: (threadId: string): ChatThread | undefined => {
    const threads = chatStorage.getThreads();
    return threads.find(t => t.id === threadId);
  },

  markAsRead: (threadId: string): void => {
    const threads = chatStorage.getThreads();
    const threadIndex = threads.findIndex(t => t.id === threadId);
    
    if (threadIndex !== -1) {
      threads[threadIndex].unread = false;
      chatStorage.saveThreads(threads);
    }
  }
};
