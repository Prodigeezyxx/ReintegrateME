
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface AboutSectionProps {
  profile: any;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  isEditing,
  onUpdate
}) => {
  const [bio, setBio] = useState(profile.bio || '');

  const handleSave = () => {
    onUpdate({ bio });
  };

  const maxLength = 250;
  const remainingChars = maxLength - bio.length;

  return (
    <Card className="ios-card">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <FileText className="h-5 w-5 text-blue-600 mr-2" />
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea 
              placeholder="Write a short personal statement that introduces you to potential employers. Highlight your strengths, experience, and what makes you a great candidate."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, maxLength))}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center text-sm">
              <span className={`${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {remainingChars} characters remaining
              </span>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        ) : (
          <div>
            {bio ? (
              <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No personal statement added yet. Click Edit to add one.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
