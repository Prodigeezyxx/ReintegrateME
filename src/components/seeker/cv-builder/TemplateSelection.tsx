
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, FileText, Zap, Shield } from 'lucide-react';
import { CVData, CVTemplate } from '@/types/cv';

const templates: CVTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with accent colors',
    preview: '/api/placeholder/200/280',
    isATSOptimized: true,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    preview: '/api/placeholder/200/280',
    isATSOptimized: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, clean design focused on content',
    preview: '/api/placeholder/200/280',
    isATSOptimized: true,
  },
];

interface TemplateSelectionProps {
  cvData: CVData;
  updateCVData: (updates: Partial<CVData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  cvData,
  updateCVData,
  onNext,
}) => {
  const handleTemplateSelect = (templateId: string) => {
    updateCVData({ template: templateId });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-6 w-6 text-slate-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-geist">Choose Your CV Template</h1>
        <p className="text-slate-600 font-geist">
          Select a professional template that best represents your style. All templates are ATS-optimized.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`ios-card cursor-pointer transition-all duration-200 touch-manipulation ${
              cvData.template === template.id
                ? 'ring-2 ring-reintegrate-blue bg-reintegrate-blue/5'
                : 'hover:shadow-lg hover:-translate-y-1'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200">
                    <FileText className="h-8 w-8 text-slate-600" />
                  </div>
                  {cvData.template === template.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-reintegrate-blue rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1 text-slate-900 font-geist">{template.name}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2 font-geist">
                    {template.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {template.isATSOptimized && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                        <Shield className="h-3 w-3 mr-1" />
                        ATS Optimized
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs border-slate-300 text-slate-700">
                      <Zap className="h-3 w-3 mr-1" />
                      Professional
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pb-6">
        <Button 
          onClick={onNext} 
          disabled={!cvData.template}
          variant="brand-primary"
          size="lg"
          className="touch-manipulation w-full max-w-xs disabled:opacity-50 font-geist"
        >
          Continue with {templates.find(t => t.id === cvData.template)?.name || 'Selected'} Template
        </Button>
      </div>
    </div>
  );
};
