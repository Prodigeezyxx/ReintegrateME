import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, Target, Lightbulb } from 'lucide-react';
import { CVData } from '@/types/cv';

const sampleSummaries = [
  "Experienced software developer with 5+ years of expertise in full-stack development. Proven track record of delivering scalable web applications using React, Node.js, and cloud technologies. Strong problem-solving skills and passion for clean, maintainable code.",
  "Results-driven marketing professional with 3+ years experience in digital marketing and brand management. Skilled in social media strategy, content creation, and data analytics. Successfully increased brand engagement by 150% through innovative campaigns.",
  "Detail-oriented project manager with 7+ years experience leading cross-functional teams. Expert in Agile methodologies and stakeholder management. Delivered 20+ projects on time and under budget, improving operational efficiency by 30%."
];

interface ProfessionalSummaryStepProps {
  cvData: CVData;
  updateCVData: (updates: Partial<CVData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ProfessionalSummaryStep: React.FC<ProfessionalSummaryStepProps> = ({
  cvData,
  updateCVData,
  onNext,
}) => {
  const [showSamples, setShowSamples] = useState(false);

  const handleSummaryChange = (content: string) => {
    updateCVData({
      professionalSummary: { content },
    });
  };

  const useSample = (sample: string) => {
    handleSummaryChange(sample);
    setShowSamples(false);
  };

  const isFormValid = () => {
    return cvData.professionalSummary.content.trim().length >= 50;
  };

  const wordCount = cvData.professionalSummary.content.split(' ').filter(word => word.length > 0).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Professional Summary</h2>
        <p className="text-muted-foreground">
          Write a compelling summary that highlights your key strengths and achievements
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write a 2-3 sentence summary highlighting your experience, key skills, and what makes you unique..."
            value={cvData.professionalSummary.content}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="min-h-32 resize-none"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{cvData.professionalSummary.content.length}/500 characters</span>
          </div>

          {!isFormValid() && cvData.professionalSummary.content.length > 0 && (
            <p className="text-sm text-yellow-600">
              Your summary should be at least 50 characters long for best results
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Writing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Do Include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Years of experience</li>
                <li>• Key skills and expertise</li>
                <li>• Notable achievements</li>
                <li>• Industry keywords</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Avoid:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First person pronouns (I, me)</li>
                <li>• Generic statements</li>
                <li>• Overly complex jargon</li>
                <li>• Salary expectations</li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSamples(!showSamples)}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showSamples ? 'Hide' : 'Show'} Example Summaries
            </Button>
          </div>

          {showSamples && (
            <div className="mt-4 space-y-3">
              {sampleSummaries.map((sample, index) => (
                <Card key={index} className="p-3 cursor-pointer hover:bg-muted/50" onClick={() => useSample(sample)}>
                  <p className="text-sm">{sample}</p>
                  <div className="mt-2">
                    <Badge variant="outline">Click to use</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
        >
          Continue to Work Experience
        </Button>
      </div>
    </div>
  );
};