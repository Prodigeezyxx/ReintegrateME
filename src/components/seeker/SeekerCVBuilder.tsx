
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Download, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeekerCVBuilder = () => {
  const navigate = useNavigate();

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
        <FileText className="h-6 w-6 text-green-600 mr-2" />
        <h1 className="text-2xl font-bold">CV Builder</h1>
      </div>

      <div className="space-y-4">
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-lg">Your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No CV Yet</h3>
              <p className="text-gray-500 mb-6">Create your first CV to get started</p>
              <Button className="bg-green-600 hover:bg-green-700">
                <Edit className="h-4 w-4 mr-2" />
                Create CV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-lg">CV Builder Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Edit className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">AI-Powered Writing</p>
                  <p className="text-sm text-gray-600">Get help writing compelling content</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Professional Templates</p>
                  <p className="text-sm text-gray-600">Choose from modern, ATS-friendly designs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Easy Export</p>
                  <p className="text-sm text-gray-600">Download as PDF or share online</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerCVBuilder;
