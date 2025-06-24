
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText, ArrowLeft, MessageSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeekerAISuite = () => {
  const navigate = useNavigate();

  const aiFeatures = [
    {
      title: 'AI Coach',
      description: 'Get personalised guidance for job searching, interviews, and workplace skills',
      icon: <Bot className="h-8 w-8" />,
      path: '/seeker-ai-coach',
      color: 'bg-blue-500'
    },
    {
      title: 'CV Builder',
      description: 'Create and optimise your resume with AI assistance',
      icon: <FileText className="h-8 w-8" />,
      path: '/seeker-cv-builder',
      color: 'bg-green-500'
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
        <h1 className="text-2xl font-bold">AI Suite</h1>
      </div>

      <div className="space-y-4 mb-8">
        {aiFeatures.map((feature, index) => (
          <Card 
            key={index} 
            className="ios-card cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => navigate(feature.path)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Assistant Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Personalised Coaching</p>
                <p className="text-gray-600">Get tailored advice for your specific situation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Interview Preparation</p>
                <p className="text-gray-600">Practice common questions and build confidence</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Resume Optimisation</p>
                <p className="text-gray-600">Create compelling CVs that get noticed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekerAISuite;
