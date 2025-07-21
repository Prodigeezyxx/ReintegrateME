
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
    return <CVBuilderFlow onClose={() => setShowCVBuilder(false)} />;
  }

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="p-6 pb-20">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/seeker-ai-suite')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <FileText className="h-6 w-6 text-slate-700 mr-2" />
          <h1 className="text-2xl font-bold text-slate-900 font-geist">CV Builder</h1>
        </div>

        <div className="space-y-4">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 font-geist">Your CV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
                  <FileText className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 font-geist">No CV Yet</h3>
                <p className="text-slate-600 mb-6 font-geist">Create your first professional CV to get started</p>
                <Button 
                  onClick={() => setShowCVBuilder(true)} 
                  size="lg" 
                  variant="brand-primary"
                  className="touch-manipulation font-geist"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Create CV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 font-geist">CV Builder Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-8 h-8 bg-reintegrate-blue rounded-lg flex items-center justify-center">
                    <Edit className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 font-geist">AI-Powered Writing</p>
                    <p className="text-sm text-slate-600 font-geist">Get help writing compelling content</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-8 h-8 bg-reintegrate-orange rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 font-geist">Professional Templates</p>
                    <p className="text-sm text-slate-600 font-geist">Choose from modern, ATS-friendly designs</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-8 h-8 bg-reintegrate-blue rounded-lg flex items-center justify-center">
                    <Download className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 font-geist">Easy Export</p>
                    <p className="text-sm text-slate-600 font-geist">Download as PDF or share online</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeekerCVBuilder;
