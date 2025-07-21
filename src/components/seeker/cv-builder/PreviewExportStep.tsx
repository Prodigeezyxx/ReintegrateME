
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
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-amber-700';
    return 'text-red-700';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="h-6 w-6 text-slate-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-geist">Preview & Export</h1>
        <p className="text-slate-600 font-geist">
          Review your CV and download when ready
        </p>
      </div>

      <div className="space-y-6">
        {/* ATS Score Card */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-900 font-geist">
              <CheckCircle className="h-5 w-5 text-slate-600" />
              ATS Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(score)} font-geist`}>
                  {score}%
                </div>
                <Badge className={`text-sm font-medium ${getScoreBadgeColor(score)}`}>
                  {getScoreLabel(score)}
                </Badge>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-300 flex items-center justify-center">
                <span className="text-xs font-medium text-slate-700 font-geist">{score}%</span>
              </div>
            </div>

            <div className="space-y-3">
              {checks.map((check, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  {check.passed ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`font-geist ${check.passed ? 'text-slate-700' : 'text-slate-600'}`}>
                    {check.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <Button onClick={handleDownloadPDF} className="w-full h-11 touch-manipulation font-geist">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleDownloadPlainText} variant="outline" className="w-full h-11 touch-manipulation font-geist">
                <FileText className="h-4 w-4 mr-2" />
                Download ATS Version
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CV Preview */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 font-geist">CV Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div className="text-center border-b border-slate-200 pb-4">
              <h1 className="text-xl font-bold mb-2 text-slate-900 font-geist">{cvData.personalInfo.fullName}</h1>
              <div className="text-sm text-slate-600 space-y-1 font-geist">
                <div>{cvData.personalInfo.email}</div>
                <div>{cvData.personalInfo.phone}</div>
                <div>{cvData.personalInfo.location}</div>
              </div>
              {(cvData.personalInfo.linkedin || cvData.personalInfo.website) && (
                <div className="text-sm text-slate-600 mt-2 space-y-1 font-geist">
                  {cvData.personalInfo.linkedin && <div className="break-all">{cvData.personalInfo.linkedin}</div>}
                  {cvData.personalInfo.website && <div className="break-all">{cvData.personalInfo.website}</div>}
                </div>
              )}
            </div>

            {/* Professional Summary */}
            {cvData.professionalSummary.content && (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-slate-900 font-geist">Professional Summary</h2>
                <p className="text-sm text-slate-700 leading-relaxed font-geist">{cvData.professionalSummary.content}</p>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-slate-900 font-geist">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {cvData.workExperience.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-slate-900 font-geist">Work Experience</h2>
                <div className="space-y-4">
                  {cvData.workExperience.map((exp, index) => (
                    <div key={exp.id}>
                      <div className="mb-2">
                        <h3 className="font-semibold text-sm text-slate-900 font-geist">{exp.jobTitle}</h3>
                        <p className="text-sm text-slate-600 font-geist">{exp.company} • {exp.location}</p>
                        <p className="text-xs text-slate-500 font-geist">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.filter(achievement => achievement.trim()).map((achievement, achIndex) => (
                          <li key={achIndex} className="text-xs text-slate-700 leading-relaxed font-geist">{achievement}</li>
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
                <h2 className="text-lg font-semibold mb-3 text-slate-900 font-geist">Education</h2>
                <div className="space-y-3">
                  {cvData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-sm text-slate-900 font-geist">{edu.degree}</h3>
                      <p className="text-sm text-slate-600 font-geist">{edu.institution} • {edu.location}</p>
                      <p className="text-xs text-slate-500 font-geist">
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
                <h2 className="text-lg font-semibold mb-3 text-slate-900 font-geist">Certifications</h2>
                <div className="space-y-2">
                  {cvData.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-slate-900 font-geist">{cert.name}</h3>
                        <p className="text-sm text-slate-600 font-geist">{cert.issuer}</p>
                      </div>
                      <div className="text-xs text-slate-500 ml-2 font-geist">
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
