
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '../ui/image-upload';

interface CompanyLogoUploadProps {
  onComplete: (data: { companyName: string; logoUrl?: string }) => void;
  onBack: () => void;
  initialData?: {
    companyName?: string;
    logoUrl?: string;
  };
}

const CompanyLogoUpload: React.FC<CompanyLogoUploadProps> = ({ 
  onComplete, 
  onBack, 
  initialData 
}) => {
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialData?.logoUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter your company name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save company profile to database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('company_profiles')
        .upsert({
          user_id: user.id,
          company_name: companyName,
          logo_url: logoUrl,
          profile_completion_percentage: logoUrl ? 80 : 60,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      onComplete({ companyName, logoUrl });
      
      toast({
        title: "Success",
        description: "Company profile created successfully!",
      });

    } catch (error) {
      console.error('Company profile creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create company profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (url: string | null) => {
    setLogoUrl(url || undefined);
  };

  return (
    <div className="mobile-container p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                required
                className="bg-white"
              />
            </div>

            {/* Company Logo Upload */}
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="flex justify-center">
                <ImageUpload
                  currentImageUrl={logoUrl}
                  onImageChange={handleLogoChange}
                  bucketName="company-logos"
                  uploadPath="logos"
                  size="lg"
                  placeholder="Optional - Add your company logo"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isLoading ? 'Creating...' : 'Continue'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyLogoUpload;
