
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Download, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CVBuilderFlow } from './cv-builder/CVBuilderFlow';

const SeekerCVBuilder = () => {
  const navigate = useNavigate();
  const [showCVBuilder, setShowCVBuilder] = useState(false);

  if (showCVBuilder) {
    return (
      <div className="mobile-container flex flex-col h-screen">
        <CVBuilderFlow onClose={() => setShowCVBuilder(false)} />
      </div>
    );
  }

  return (
    <div className="mobile-container p-6 pb-20 bg-gradient-to-br from-reintegrate-light-bg via-white to-reintegrate-soft-blue/30">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/seeker-ai-suite')}
          className="mr-2 hover:bg-reintegrate-blue/10 hover:text-reintegrate-blue"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <FileText className="h-6 w-6 text-reintegrate-blue mr-2" />
        <h1 className="text-2xl font-bold text-reintegrate-blue">CV Builder</h1>
      </div>

      <div className="space-y-4">
        <Card className="border-2 border-reintegrate-gray/20 shadow-lg bg-gradient-to-br from-white to-reintegrate-light-bg">
          <CardHeader className="bg-gradient-to-r from-reintegrate-soft-blue to-transparent">
            <CardTitle className="text-lg text-reintegrate-blue">Your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-reintegrate-blue/20 to-reintegrate-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-reintegrate-blue/20">
                <FileText className="h-8 w-8 text-reintegrate-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-reintegrate-blue">No CV Yet</h3>
              <p className="text-reintegrate-gray mb-6">Create your first professional CV to get started</p>
              <Button 
                variant="brand-primary"
                onClick={() => setShowCVBuilder(true)} 
                size="lg" 
                className="min-h-11 touch-manipulation"
              >
                <Edit className="h-4 w-4 mr-2" />
                Create CV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-reintegrate-gray/20 shadow-lg bg-gradient-to-br from-white to-reintegrate-light-bg">
          <CardHeader className="bg-gradient-to-r from-reintegrate-soft-blue to-transparent">
            <CardTitle className="text-lg text-reintegrate-blue">CV Builder Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-reintegrate-soft-blue/40 to-reintegrate-soft-blue/20 rounded-lg border border-reintegrate-blue/20">
                <div className="w-8 h-8 bg-gradient-to-br from-reintegrate-blue to-reintegrate-blue-light rounded-lg flex items-center justify-center shadow-md">
                  <Edit className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-reintegrate-blue">AI-Powered Writing</p>
                  <p className="text-sm text-reintegrate-gray">Get help writing compelling content</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-reintegrate-soft-orange/40 to-reintegrate-soft-orange/20 rounded-lg border border-reintegrate-orange/20">
                <div className="w-8 h-8 bg-gradient-to-br from-reintegrate-orange to-reintegrate-orange-light rounded-lg flex items-center justify-center shadow-md">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-reintegrate-blue">Professional Templates</p>
                  <p className="text-sm text-reintegrate-gray">Choose from modern, ATS-friendly designs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-reintegrate-blue">Easy Export</p>
                  <p className="text-sm text-reintegrate-gray">Download as PDF or share online</p>
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
