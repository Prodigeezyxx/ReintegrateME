
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="p-4 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-reintegrate-blue to-reintegrate-blue-light rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-reintegrate-blue">Choose Your CV Template</h2>
        <p className="text-sm text-reintegrate-gray">
          Select a professional template that best represents your style. All templates are ATS-optimized.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 touch-manipulation hover:scale-[1.02] border-2 ${
              cvData.template === template.id
                ? 'ring-2 ring-reintegrate-blue border-reintegrate-blue bg-gradient-to-r from-reintegrate-soft-blue to-white shadow-lg'
                : 'border-reintegrate-gray/20 hover:border-reintegrate-blue/50 hover:shadow-md bg-white'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-20 bg-gradient-to-br from-reintegrate-light-bg to-reintegrate-soft-blue rounded-lg flex items-center justify-center flex-shrink-0 border border-reintegrate-gray/20">
                    <FileText className="h-8 w-8 text-reintegrate-blue" />
                  </div>
                  {cvData.template === template.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-reintegrate-blue rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1 text-reintegrate-blue">{template.name}</h3>
                  <p className="text-sm text-reintegrate-gray mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {template.isATSOptimized && (
                      <Badge variant="secondary" className="text-xs bg-reintegrate-blue/10 text-reintegrate-blue border-reintegrate-blue/20">
                        <Shield className="h-3 w-3 mr-1" />
                        ATS Optimized
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs border-reintegrate-orange text-reintegrate-orange">
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
          variant="brand-primary"
          onClick={onNext} 
          disabled={!cvData.template}
          size="lg"
          className="min-h-11 touch-manipulation w-full max-w-xs disabled:opacity-50"
        >
          Continue with {templates.find(t => t.id === cvData.template)?.name || 'Selected'} Template
        </Button>
      </div>
    </div>
  );
};
