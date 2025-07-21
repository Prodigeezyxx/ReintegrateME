
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Eye, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { CVData } from '@/types/cv';

interface PreviewExportStepProps {
  cvData: CVData;
  updateCVData: (updates: Partial<CVData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PreviewExportStep: React.FC<PreviewExportStepProps> = ({
  cvData,
}) => {
  const generateATSScore = () => {
    let score = 0;
    const checks = [];

    // Personal Info (20 points)
    if (cvData.personalInfo.fullName && cvData.personalInfo.email && cvData.personalInfo.phone) {
      score += 20;
      checks.push({ text: 'Complete contact information', passed: true });
    } else {
      checks.push({ text: 'Complete contact information', passed: false });
    }

    // Professional Summary (15 points)
    if (cvData.professionalSummary.content.length >= 50) {
      score += 15;
      checks.push({ text: 'Professional summary present', passed: true });
    } else {
      checks.push({ text: 'Professional summary present', passed: false });
    }

    // Work Experience (25 points)
    if (cvData.workExperience.length > 0 && cvData.workExperience.every(exp => exp.jobTitle && exp.company)) {
      score += 25;
      checks.push({ text: 'Work experience detailed', passed: true });
    } else {
      checks.push({ text: 'Work experience detailed', passed: false });
    }

    // Skills (20 points)
    if (cvData.skills.length >= 5) {
      score += 20;
      checks.push({ text: 'Sufficient skills listed (5+)', passed: true });
    } else {
      checks.push({ text: 'Sufficient skills listed (5+)', passed: false });
    }

    // Education (10 points)
    if (cvData.education.length > 0) {
      score += 10;
      checks.push({ text: 'Education information included', passed: true });
    } else {
      checks.push({ text: 'Education information included', passed: false });
    }

    // Achievements with metrics (10 points)
    const hasQuantifiedAchievements = cvData.workExperience.some(exp => 
      exp.achievements.some(achievement => 
        /\d+%|\d+\$|\d+k|\d+ years|\d+ months/.test(achievement)
      )
    );
    if (hasQuantifiedAchievements) {
      score += 10;
      checks.push({ text: 'Quantified achievements included', passed: true });
    } else {
      checks.push({ text: 'Quantified achievements included', passed: false });
    }

    return { score, checks };
  };

  const { score, checks } = generateATSScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-reintegrate-blue';
    if (score >= 60) return 'text-reintegrate-orange';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF with data:', cvData);
    alert('PDF download functionality would be implemented here');
  };

  const handleDownloadPlainText = () => {
    console.log('Downloading plain text with data:', cvData);
    alert('Plain text download functionality would be implemented here');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Eye className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Preview & Export</h2>
        <p className="text-sm text-muted-foreground">
          Review your CV and download when ready
        </p>
      </div>

      <div className="space-y-6">
        {/* ATS Score Card - Mobile First */}
        <Card className="beautiful-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5 text-reintegrate-blue" />
              ATS Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </div>
                <p className={`text-sm font-medium ${getScoreColor(score)}`}>
                  {getScoreLabel(score)}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center">
                <span className="text-xs font-medium">{score}%</span>
              </div>
            </div>

            <div className="space-y-3">
              {checks.map((check, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  {check.passed ? (
                    <CheckCircle className="h-4 w-4 text-reintegrate-blue mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-reintegrate-orange mt-0.5 flex-shrink-0" />
                  )}
                  <span className={check.passed ? 'text-foreground' : 'text-muted-foreground'}>
                    {check.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <Button onClick={handleDownloadPDF} className="w-full h-11 touch-manipulation bg-reintegrate-orange hover:bg-reintegrate-orange/90">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleDownloadPlainText} variant="outline" className="w-full h-11 touch-manipulation">
                <FileText className="h-4 w-4 mr-2" />
                Download ATS Version
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CV Preview - Mobile Optimized */}
        <Card className="beautiful-shadow">
          <CardHeader>
            <CardTitle className="text-lg">CV Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div className="text-center border-b pb-4">
              <h1 className="text-xl font-bold mb-2">{cvData.personalInfo.fullName}</h1>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>{cvData.personalInfo.email}</div>
                <div>{cvData.personalInfo.phone}</div>
                <div>{cvData.personalInfo.location}</div>
              </div>
              {(cvData.personalInfo.linkedin || cvData.personalInfo.website) && (
                <div className="text-sm text-muted-foreground mt-2 space-y-1">
                  {cvData.personalInfo.linkedin && <div className="break-all">{cvData.personalInfo.linkedin}</div>}
                  {cvData.personalInfo.website && <div className="break-all">{cvData.personalInfo.website}</div>}
                </div>
              )}
            </div>

            {/* Professional Summary */}
            {cvData.professionalSummary.content && (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-reintegrate-blue">Professional Summary</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{cvData.professionalSummary.content}</p>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-reintegrate-blue">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {cvData.workExperience.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-reintegrate-blue">Work Experience</h2>
                <div className="space-y-4">
                  {cvData.workExperience.map((exp, index) => (
                    <div key={exp.id}>
                      <div className="mb-2">
                        <h3 className="font-semibold text-sm">{exp.jobTitle}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.filter(achievement => achievement.trim()).map((achievement, achIndex) => (
                          <li key={achIndex} className="text-xs text-muted-foreground leading-relaxed">{achievement}</li>
                        ))}
                      </ul>
                      {index < cvData.workExperience.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-reintegrate-blue">Education</h2>
                <div className="space-y-3">
                  {cvData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-sm">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.institution} • {edu.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {cvData.certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-reintegrate-blue">Certifications</h2>
                <div className="space-y-2">
                  {cvData.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <div className="text-xs text-muted-foreground ml-2">
                        {cert.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
