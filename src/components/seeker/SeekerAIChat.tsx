
import React, { useState, useRef, useEffect } from 'react';
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
      return "Great question about interview preparation! Here are some key tips:\n\n• Research the company thoroughly - their values, recent news, and culture\n• Practice common questions like 'Tell me about yourself' and 'Why do you want this role?'\n• Prepare specific examples using the STAR method (Situation, Task, Action, Result)\n• Have thoughtful questions ready about the role and company\n• Practice good body language and maintain eye contact\n\nWould you like me to help you practice answering specific interview questions?";
    }
    
    if (lowerMessage.includes('cv') || lowerMessage.includes('resume')) {
      return "I'd be happy to help with your CV! Here are some essential tips:\n\n• Keep it to 1-2 pages maximum\n• Use a clean, professional format with consistent fonts\n• Start with a compelling personal statement (2-3 lines)\n• Focus on achievements, not just duties - use numbers where possible\n• Tailor it for each job application\n• Include relevant keywords from the job description\n• Proofread carefully for any errors\n\nWhat specific aspect of your CV would you like to improve?";
    }
    
    if (lowerMessage.includes('salary') || lowerMessage.includes('negotiate')) {
      return "Salary negotiation is crucial! Here's how to approach it:\n\n• Research market rates for your role and location\n• Wait for them to make the first offer if possible\n• Consider the entire package (benefits, vacation, development opportunities)\n• Be confident but respectful in your negotiation\n• Have a clear minimum you'll accept\n• Practice your negotiation conversation beforehand\n\nRemember, most employers expect some negotiation - it shows you value yourself!";
    }
    
    if (lowerMessage.includes('cover letter')) {
      return "A great cover letter can set you apart! Here's the structure:\n\n• Opening: Hook them with enthusiasm and mention the specific role\n• Body: Connect your experience to their needs (2-3 key points)\n• Show you've researched the company\n• Closing: Strong call to action and thank them\n\nKeep it to one page, personalize it for each application, and let your personality shine through while staying professional.";
    }
    
    if (lowerMessage.includes('job search') || lowerMessage.includes('find job')) {
      return "Here's a strategic approach to job searching:\n\n• Use multiple channels: job boards, company websites, networking, recruiters\n• Set up job alerts with relevant keywords\n• Optimize your LinkedIn profile\n• Network actively - 70% of jobs aren't publicly advertised\n• Follow up on applications after 1-2 weeks\n• Track your applications in a spreadsheet\n• Don't put all your eggs in one basket - apply broadly\n\nConsistency is key - make job searching a daily habit!";
    }
    
    if (lowerMessage.includes('linkedin')) {
      return "LinkedIn is powerful for job searching! Here's how to optimize it:\n\n• Professional headshot photo\n• Compelling headline that goes beyond your job title\n• Detailed summary showcasing your value\n• Complete work experience with achievements\n• Skills section with endorsements\n• Regular posts and engagement with your network\n• Join relevant industry groups\n• Use the 'Open to Work' feature strategically\n\nRemember: recruiters actively search LinkedIn for candidates!";
    }
    
    if (lowerMessage.includes('network') || lowerMessage.includes('connections')) {
      return "Networking is one of the most effective job search strategies:\n\n• Start with your existing contacts - friends, family, former colleagues\n• Attend industry events and meetups\n• Join professional associations\n• Engage authentically on LinkedIn\n• Offer help to others before asking for favors\n• Follow up and maintain relationships\n• Consider informational interviews\n\nRemember: people hire people they know and trust!";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! I'm here to support your job search journey. Remember, finding the right opportunity takes time and persistence, but you've got this! \n\nIs there anything else about your job search I can help you with today?";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worry')) {
      return "Job searching can definitely be stressful - you're not alone in feeling this way! Here are some strategies to manage the stress:\n\n• Set realistic daily/weekly goals\n• Take breaks and maintain work-life balance\n• Celebrate small wins (applications sent, interviews scheduled)\n• Stay organized with a job search tracker\n• Practice self-care and maintain your routine\n• Remember that rejection isn't personal\n• Focus on what you can control\n\nYour mental health is important - take care of yourself throughout this process!";
    }
    
    // Default responses for general queries
    const defaultResponses = [
      "That's a great question! I'm here to help with your job search. Could you be more specific about what aspect you'd like assistance with? I can help with interview prep, CV writing, job search strategies, or career advice.",
      "I'd love to help you with that! For the most relevant advice, could you tell me more about your specific situation or what particular challenge you're facing in your job search?",
      "Absolutely! I'm equipped to help with various aspects of job searching. What specific area would you like to focus on - finding opportunities, application materials, interview preparation, or something else?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

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
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockResponse(inputText),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
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
            <h1 className="font-semibold">AI Job Coach</h1>
            <p className="text-xs text-gray-500">Always here to help with your career</p>
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
            <div className={`flex items-end space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                {message.sender === 'user' ? (
                  <User className="h-3 w-3 text-white" />
                ) : (
                  <Bot className="h-3 w-3 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2 max-w-[85%]">
              <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-500">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="rounded-lg p-3 bg-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            placeholder="Ask me about interviews, CVs, job searching..."
            className="flex-1 ios-input"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-orange-500 hover:bg-orange-600"
            disabled={!inputText.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerAIChat;
