
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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-6 w-6 text-slate-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-geist">Professional Summary</h1>
        <p className="text-slate-600 font-geist">
          Write a compelling summary that highlights your key strengths
        </p>
      </div>

      <Card className="ios-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-900 font-geist">
            <Target className="h-5 w-5 text-slate-600" />
            Your Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write a 2-3 sentence summary highlighting your experience, key skills, and what makes you unique..."
            value={cvData.professionalSummary.content}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="min-h-32 resize-none touch-manipulation border-slate-300 focus:border-reintegrate-blue focus:ring-reintegrate-blue font-geist"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between text-sm text-slate-600 font-geist">
            <span className="text-slate-700 font-medium">{wordCount} words</span>
            <span>{cvData.professionalSummary.content.length}/500 characters</span>
          </div>

          {!isFormValid() && cvData.professionalSummary.content.length > 0 && (
            <p className="text-sm text-amber-600 font-medium font-geist">
              Your summary should be at least 50 characters long for best results
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-900 font-geist">
            <Lightbulb className="h-5 w-5 text-slate-600" />
            Writing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700 font-geist">Do Include:</h4>
                <ul className="text-sm text-slate-600 space-y-1 font-geist">
                  <li>• Years of experience</li>
                  <li>• Key skills and expertise</li>
                  <li>• Notable achievements</li>
                  <li>• Industry keywords</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-amber-700 font-geist">Avoid:</h4>
                <ul className="text-sm text-slate-600 space-y-1 font-geist">
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
              className="w-full h-11 touch-manipulation font-geist"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showSamples ? 'Hide' : 'Show'} Example Summaries
            </Button>

            {showSamples && (
              <div className="mt-4 space-y-3">
                {sampleSummaries.map((sample, index) => (
                  <Card key={index} className="p-3 cursor-pointer hover:bg-slate-50 transition-colors touch-manipulation border border-slate-200 hover:border-slate-300" onClick={() => useSample(sample)}>
                    <p className="text-sm leading-relaxed text-slate-600 font-geist">{sample}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs border-slate-300 text-slate-700">Click to use</Badge>
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
          variant="brand-primary"
          size="lg"
          className="touch-manipulation w-full max-w-xs disabled:opacity-50 font-geist"
        >
          Continue to Work Experience
        </Button>
      </div>
    </div>
  );
};
