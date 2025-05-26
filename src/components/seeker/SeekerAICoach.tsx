
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

type MessageRole = "user" | "coach";

interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

const coachingTopics = [
  "Interview preparation",
  "Workplace communication", 
  "Stress management",
  "Goal setting",
  "Conflict resolution",
  "Daily routines",
  "Job search strategies",
  "Building relationships"
];

const SeekerAICoach = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your reintegration coach. I'm here to support you with job searching, workplace skills, stress management, and building a successful future. What would you like to talk about today?",
      role: "coach",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateCoachResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("interview") || input.includes("job")) {
      return "Great! Interview preparation is crucial. Let's start with the basics: Can you tell me what type of position you're applying for? I can help you practice common questions, discuss how to address your background professionally, and work on presenting your strengths confidently.";
    }
    
    if (input.includes("stress") || input.includes("anxiety") || input.includes("overwhelmed")) {
      return "I understand that reintegration can feel overwhelming at times. That's completely normal. One technique that helps many people is the 4-7-8 breathing method: breathe in for 4 counts, hold for 7, exhale for 8. Have you noticed specific situations that trigger stress for you?";
    }
    
    if (input.includes("workplace") || input.includes("coworker") || input.includes("boss")) {
      return "Workplace relationships are so important for success. The key is professional communication, active listening, and building trust gradually. What specific workplace situation are you concerned about? I can help you practice appropriate responses.";
    }
    
    if (input.includes("goal") || input.includes("plan") || input.includes("future")) {
      return "Setting clear, achievable goals is essential for successful reintegration. I recommend starting with SMART goals - Specific, Measurable, Achievable, Relevant, and Time-bound. What's one thing you'd like to accomplish in the next 30 days?";
    }
    
    if (input.includes("housing") || input.includes("place to live") || input.includes("apartment")) {
      return "Housing is one of the biggest challenges during reintegration. Have you looked into transitional housing programs or second-chance housing providers in your area? I can help you prepare for housing applications and landlord conversations.";
    }
    
    if (input.includes("parole") || input.includes("probation") || input.includes("legal")) {
      return "Staying compliant with legal requirements is crucial for your success. It's great that you're being proactive about this. What specific legal or compliance questions do you have? Remember, I always recommend consulting with your legal counsel for specific legal advice.";
    }
    
    return "I appreciate you sharing that with me. Your reintegration journey is unique, and every step forward matters. Can you tell me more about what's on your mind? I'm here to listen and help you work through any challenges you're facing.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    setTimeout(() => {
      const response = generateCoachResponse(inputValue);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "coach",
        timestamp: new Date()
      }]);
      
      setIsProcessing(false);
    }, 1000);
  };

  const handleSuggestedTopic = (topic: string) => {
    setInputValue(`I'd like help with ${topic.toLowerCase()}`);
  };

  return (
    <div className="mobile-container p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/seeker-ai-suite')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Bot className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold">AI Coach</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-lg border">
          <div className="h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.role === "user" ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isProcessing}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isProcessing || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Quick Topics */}
        <div className="bg-white rounded-lg shadow-lg border p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Quick Topics
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {coachingTopics.map(topic => (
              <Button
                key={topic}
                variant="outline"
                className="justify-start text-left h-auto py-2 text-xs"
                onClick={() => handleSuggestedTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-800">💡 Coach Tip</h4>
            <p className="text-xs text-blue-700">
              Regular coaching conversations can help you build confidence and develop strategies for success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerAICoach;
