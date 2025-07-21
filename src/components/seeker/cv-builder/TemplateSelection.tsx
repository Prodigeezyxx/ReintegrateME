
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
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Choose Your CV Template</h2>
        <p className="text-sm text-muted-foreground">
          Select a professional template that best represents your style. All templates are ATS-optimized.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 touch-manipulation hover:scale-[1.02] ${
              cvData.template === template.id
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/50 hover:shadow-md'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  {cvData.template === template.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {template.isATSOptimized && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        ATS Optimized
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
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
          size="lg"
          className="min-h-11 touch-manipulation w-full max-w-xs"
        >
          Continue with {templates.find(t => t.id === cvData.template)?.name || 'Selected'} Template
        </Button>
      </div>
    </div>
  );
};
