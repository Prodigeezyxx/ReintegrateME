
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, Target, Lightbulb } from 'lucide-react';
import { CVData } from '@/types/cv';

const sampleSummaries = [
  "Experienced retail sales assistant with 3+ years in customer service and product knowledge. Proven track record of exceeding sales targets and building strong customer relationships. Skilled in cash handling, inventory management, and creating positive shopping experiences.",
  "Dedicated care worker with 5+ years experience supporting elderly and vulnerable adults. Compassionate professional skilled in personal care, medication administration, and emotional support. Strong communication skills and commitment to maintaining dignity and independence.",
  "Reliable warehouse operative with 4+ years experience in fast-paced distribution environments. Expert in picking, packing, and quality control procedures. Strong safety record and proven ability to work efficiently both independently and as part of a team."
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
        <div className="w-12 h-12 bg-gradient-to-br from-reintegrate-blue to-reintegrate-blue-light rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-reintegrate-blue">Professional Summary</h2>
        <p className="text-sm text-reintegrate-gray">
          Write a compelling summary that highlights your key strengths
        </p>
      </div>

      <Card className="mb-6 border-2 border-reintegrate-gray/20 shadow-lg bg-gradient-to-br from-white to-reintegrate-light-bg">
        <CardHeader className="pb-4 bg-gradient-to-r from-reintegrate-soft-orange/30 to-transparent">
          <CardTitle className="flex items-center gap-2 text-lg text-reintegrate-blue">
            <Target className="h-5 w-5 text-reintegrate-orange" />
            Your Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write a 2-3 sentence summary highlighting your experience, key skills, and what makes you unique..."
            value={cvData.professionalSummary.content}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="min-h-32 resize-none touch-manipulation border-reintegrate-gray/30 focus:border-reintegrate-blue focus:ring-reintegrate-blue/20"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between text-sm text-reintegrate-gray">
            <span className="text-reintegrate-blue font-medium">{wordCount} words</span>
            <span>{cvData.professionalSummary.content.length}/500 characters</span>
          </div>

          {!isFormValid() && cvData.professionalSummary.content.length > 0 && (
            <p className="text-sm text-reintegrate-orange font-medium">
              Your summary should be at least 50 characters long for best results
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-reintegrate-gray/20 shadow-lg bg-gradient-to-br from-white to-reintegrate-light-bg">
        <CardHeader className="pb-4 bg-gradient-to-r from-reintegrate-soft-blue to-transparent">
          <CardTitle className="flex items-center gap-2 text-lg text-reintegrate-blue">
            <Lightbulb className="h-5 w-5 text-reintegrate-orange" />
            Writing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-reintegrate-blue">Do Include:</h4>
                <ul className="text-sm text-reintegrate-gray space-y-1">
                  <li>• Years of experience</li>
                  <li>• Key skills and expertise</li>
                  <li>• Notable achievements</li>
                  <li>• Industry keywords</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-reintegrate-orange">Avoid:</h4>
                <ul className="text-sm text-reintegrate-gray space-y-1">
                  <li>• First person pronouns (I, me)</li>
                  <li>• Generic statements</li>
                  <li>• Overly complex jargon</li>
                  <li>• Salary expectations</li>
                </ul>
              </div>
            </div>

            <Button 
              variant="brand-outline"
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
                  <Card key={index} className="p-3 cursor-pointer hover:bg-reintegrate-soft-blue/30 transition-colors touch-manipulation border border-reintegrate-gray/30 hover:border-reintegrate-blue/50" onClick={() => useSample(sample)}>
                    <p className="text-sm leading-relaxed text-reintegrate-gray">{sample}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs border-reintegrate-blue text-reintegrate-blue">Click to use</Badge>
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
          variant="brand-primary"
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
          className="min-h-11 touch-manipulation w-full max-w-xs disabled:opacity-50"
        >
          Continue to Work Experience
        </Button>
      </div>
    </div>
  );
};
