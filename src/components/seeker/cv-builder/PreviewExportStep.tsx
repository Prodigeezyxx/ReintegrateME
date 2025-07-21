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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const handleDownloadPDF = () => {
    // This would integrate with a PDF generation service
    console.log('Downloading PDF with data:', cvData);
    alert('PDF download functionality would be implemented here');
  };

  const handleDownloadPlainText = () => {
    // Generate plain text version for ATS systems
    console.log('Downloading plain text with data:', cvData);
    alert('Plain text download functionality would be implemented here');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Preview & Export</h2>
        <p className="text-muted-foreground">
          Review your CV and download when ready
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ATS Score Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              ATS Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <p className={`text-sm font-medium ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </p>
            </div>

            <div className="space-y-2">
              {checks.map((check, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {check.passed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={check.passed ? 'text-green-700' : 'text-red-700'}>
                    {check.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-2">
              <Button onClick={handleDownloadPDF} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleDownloadPlainText} variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download ATS Version
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CV Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>CV Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold">{cvData.personalInfo.fullName}</h1>
              <div className="text-muted-foreground mt-2 space-x-2">
                <span>{cvData.personalInfo.email}</span>
                <span>•</span>
                <span>{cvData.personalInfo.phone}</span>
                <span>•</span>
                <span>{cvData.personalInfo.location}</span>
              </div>
              {(cvData.personalInfo.linkedin || cvData.personalInfo.website) && (
                <div className="text-muted-foreground mt-1 space-x-2">
                  {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
                  {cvData.personalInfo.linkedin && cvData.personalInfo.website && <span>•</span>}
                  {cvData.personalInfo.website && <span>{cvData.personalInfo.website}</span>}
                </div>
              )}
            </div>

            {/* Professional Summary */}
            {cvData.professionalSummary.content && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
                <p className="text-muted-foreground">{cvData.professionalSummary.content}</p>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {cvData.workExperience.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Work Experience</h2>
                <div className="space-y-4">
                  {cvData.workExperience.map((exp, index) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{exp.jobTitle}</h3>
                          <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {exp.achievements.filter(achievement => achievement.trim()).map((achievement, achIndex) => (
                          <li key={achIndex} className="text-muted-foreground">{achievement}</li>
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
                <h2 className="text-xl font-semibold mb-3">Education</h2>
                <div className="space-y-3">
                  {cvData.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.institution} • {edu.location}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {cvData.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Certifications</h2>
                <div className="space-y-2">
                  {cvData.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
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