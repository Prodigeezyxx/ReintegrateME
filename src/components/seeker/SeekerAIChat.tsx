
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SeekerAIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI job search assistant. I can help you with interview preparation, CV tips, job search strategies, and answer questions about your applications. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! This is a placeholder response. The AI functionality will be implemented soon with features like interview tips, CV feedback, and job search advice.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="mobile-container flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/seeker-dashboard')}
          className="mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">AI Assistant</h1>
            <p className="text-xs text-gray-500">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                {message.sender === 'user' ? (
                  <User className="h-3 w-3 text-white" />
                ) : (
                  <Bot className="h-3 w-3 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about job searching..."
            className="flex-1 ios-input"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-orange-500 hover:bg-orange-600"
            disabled={!inputText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerAIChat;
