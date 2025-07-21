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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Choose Your CV Template</h2>
        <p className="text-muted-foreground">
          Select a professional template that best represents your style. All templates are ATS-optimized.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              cvData.template === template.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader className="text-center p-4">
              <div className="relative mb-3">
                <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
                {cvData.template === template.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>
              <div className="flex gap-2">
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext} 
          disabled={!cvData.template}
          size="lg"
        >
          Continue with {templates.find(t => t.id === cvData.template)?.name || 'Selected'} Template
        </Button>
      </div>
    </div>
  );
};