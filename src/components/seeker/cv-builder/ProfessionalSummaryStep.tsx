
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
    <div className="p-4 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a compelling summary that highlights your key strengths
        </p>
      </div>

      <Card className="mb-6 beautiful-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-reintegrate-orange" />
            Your Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write a 2-3 sentence summary highlighting your experience, key skills, and what makes you unique..."
            value={cvData.professionalSummary.content}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="min-h-32 resize-none touch-manipulation"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{cvData.professionalSummary.content.length}/500 characters</span>
          </div>

          {!isFormValid() && cvData.professionalSummary.content.length > 0 && (
            <p className="text-sm text-reintegrate-orange">
              Your summary should be at least 50 characters long for best results
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="beautiful-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-reintegrate-blue" />
            Writing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-reintegrate-blue">Do Include:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Years of experience</li>
                  <li>• Key skills and expertise</li>
                  <li>• Notable achievements</li>
                  <li>• Industry keywords</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-reintegrate-orange">Avoid:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• First person pronouns (I, me)</li>
                  <li>• Generic statements</li>
                  <li>• Overly complex jargon</li>
                  <li>• Salary expectations</li>
                </ul>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSamples(!showSamples)}
              className="w-full h-11 touch-manipulation"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showSamples ? 'Hide' : 'Show'} Example Summaries
            </Button>

            {showSamples && (
              <div className="mt-4 space-y-3">
                {sampleSummaries.map((sample, index) => (
                  <Card key={index} className="p-3 cursor-pointer hover:bg-muted/50 transition-colors touch-manipulation" onClick={() => useSample(sample)}>
                    <p className="text-sm leading-relaxed">{sample}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">Click to use</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-6 pb-6">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
          className="min-h-11 touch-manipulation w-full max-w-xs bg-reintegrate-orange hover:bg-reintegrate-orange/90 disabled:opacity-50"
        >
          Continue to Work Experience
        </Button>
      </div>
    </div>
  );
};
