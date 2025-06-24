
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { profileSetupManager } from '../../utils/profileSetupManager';

const SeekerDisclosure = () => {
  const navigate = useNavigate();
  const savedData = profileSetupManager.getAllData();

  const getDisclosureStatus = () => {
    if (savedData.sentenceCompleted !== undefined || savedData.hasDisability !== undefined) {
      return "Complete";
    }
    return "Pending";
  };

  const getLegalStatus = () => {
    if (savedData.sentenceCompleted === true) return "Sentence Completed";
    if (savedData.sentenceCompleted === false) return "No Criminal Record";
    return "Not Disclosed";
  };

  const getHealthStatus = () => {
    if (savedData.hasDisability === true) return "Has Disability";
    if (savedData.hasDisability === false) return "No Disability";
    return "Not Disclosed";
  };

  return (
    <div className="mobile-container p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/seeker-profile')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Disclosure Status</h1>
      </div>

      <div className="space-y-6">
        {/* Status Overview */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Disclosure Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Overall Status:</span>
              <Badge variant={getDisclosureStatus() === "Complete" ? "default" : "secondary"}>
                {getDisclosureStatus() === "Complete" ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {getDisclosureStatus()}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {getDisclosureStatus() === "Complete" 
                ? "You have completed your disclosure and are ready to discuss your background openly with employers."
                : "Complete your profile setup to provide your disclosure information."
              }
            </p>
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Legal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Criminal Record Status:</span>
                <Badge variant="outline">{getLegalStatus()}</Badge>
              </div>
              
              {savedData.convictionTypes && savedData.convictionTypes.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Conviction Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {savedData.convictionTypes.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {savedData.convictionStatus && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conviction Status:</span>
                  <Badge variant="outline">{savedData.convictionStatus}</Badge>
                </div>
              )}

              {savedData.barredFromRegulatedWork !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Barred from Regulated Work:</span>
                  <Badge variant="outline">
                    {savedData.barredFromRegulatedWork === true ? 'Yes' : 
                     savedData.barredFromRegulatedWork === false ? 'No' : 'Unknown'}
                  </Badge>
                </div>
              )}

              {savedData.onDbsBarringList !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">DBS Barring List:</span>
                  <Badge variant="outline">
                    {savedData.onDbsBarringList === true ? 'Yes' : 
                     savedData.onDbsBarringList === false ? 'No' : 'Unknown'}
                  </Badge>
                </div>
              )}

              {savedData.mappaLevel && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">MAPPA Level:</span>
                  <Badge variant="outline">
                    {savedData.mappaLevel === 'not_applicable' ? 'N/A' : 
                     `Level ${savedData.mappaLevel.split('_')[1]}`}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health & Accessibility */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Health & Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Disability Status:</span>
                <Badge variant="outline">{getHealthStatus()}</Badge>
              </div>
              
              {savedData.disabilityTypes && savedData.disabilityTypes.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Disability Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {savedData.disabilityTypes.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {savedData.workplaceAdjustments && savedData.workplaceAdjustments.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Workplace Adjustments:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {savedData.workplaceAdjustments.map((adjustment, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {adjustment.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Update Actions */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Update Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/seeker-setup-step2')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Legal Information
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/seeker-setup-step3')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Health & Accessibility
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Notice */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Your Privacy Matters:</strong> This information helps us match you with inclusive employers who value transparency. 
            You control what you share and when during the application process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeekerDisclosure;
