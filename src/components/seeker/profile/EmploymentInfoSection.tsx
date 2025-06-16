import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Heart } from 'lucide-react';

interface EmploymentInfoSectionProps {
  profile: any;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
}

const disabilityTypes = [
  { value: 'mobility_physical', label: 'Mobility / physical access needs' },
  { value: 'sensory_hearing_vision', label: 'Sensory (hearing / vision / processing)' },
  { value: 'long_term_medical', label: 'Long-term medical condition' },
  { value: 'neurodivergence', label: 'Neurodivergence (ADHD, Autism, Dyslexia, etc.)' },
  { value: 'learning_difficulty', label: 'Learning difficulty' },
  { value: 'mental_health', label: 'Mental health' },
  { value: 'communication_needs', label: 'Communication needs' },
  { value: 'cognitive_memory', label: 'Cognitive or memory difficulties' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_specify', label: 'Prefer not to specify' }
];

const workplaceAdjustments = [
  { value: 'flexible_hours', label: 'Flexible working hours' },
  { value: 'remote_work', label: 'Remote work option' },
  { value: 'training_support', label: 'Additional training support' },
  { value: 'assistive_technology', label: 'Assistive technology' },
  { value: 'modified_environment', label: 'Modified physical work environment' },
  { value: 'communication_support', label: 'Communication support' },
  { value: 'none', label: 'None' },
  { value: 'other', label: 'Other' }
];

const workPreferences = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'zero_hours', label: 'Zero Hours' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'nights', label: 'Nights' }
];

export const EmploymentInfoSection: React.FC<EmploymentInfoSectionProps> = ({
  profile,
  isEditing,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    has_disability: profile.has_disability,
    disability_types: profile.disability_types || [],
    disability_other_details: profile.disability_other_details || '',
    workplace_adjustments: profile.workplace_adjustments || [],
    workplace_adjustments_other: profile.workplace_adjustments_other || '',
    has_driving_licence: profile.has_driving_licence,
    work_preferences: profile.work_preferences || [],
    open_to_relocation: profile.open_to_relocation
  });

  const handleSave = () => {
    onUpdate(formData);
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter((item: string) => item !== value);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  if (!isEditing) {
    return (
      <Card className="ios-card">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
          <CardTitle>Employment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Has Disability:</strong> {formData.has_disability ? 'Yes' : 'No'}</p>
            <p><strong>Driving Licence:</strong> {formData.has_driving_licence ? 'Yes' : 'No'}</p>
            <p><strong>Open to Relocation:</strong> {formData.open_to_relocation ? 'Yes' : 'No'}</p>
            {formData.work_preferences.length > 0 && (
              <div>
                <strong>Work Preferences:</strong>
                <span className="ml-2">
                  {formData.work_preferences.map((pref: string) => 
                    workPreferences.find(wp => wp.value === pref)?.label
                  ).join(', ')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ios-card">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
        <CardTitle>Employment Information & Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Disability Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you consider yourself to have a disability, long-term health condition, or additional support need?
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.has_disability === true}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_disability: checked }))}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.has_disability === false}
                onCheckedChange={(checked) => {
                  if (checked) setFormData(prev => ({ ...prev, has_disability: false }));
                }}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Disability Types */}
        {formData.has_disability && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              If yes, select any that apply:
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {disabilityTypes.map((type) => (
                <label key={type.value} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={formData.disability_types.includes(type.value)}
                    onCheckedChange={(checked) => handleArrayChange('disability_types', type.value, checked as boolean)}
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Other Disability Details */}
        {formData.disability_types.includes('other') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Details
            </label>
            <Textarea 
              placeholder="Please specify..."
              value={formData.disability_other_details}
              onChange={(e) => setFormData(prev => ({ ...prev, disability_other_details: e.target.value }))}
              rows={2}
            />
          </div>
        )}

        {/* Workplace Adjustments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workplace Adjustments
          </label>
          <div className="grid grid-cols-1 gap-2">
            {workplaceAdjustments.map((adjustment) => (
              <label key={adjustment.value} className="flex items-center space-x-2">
                <Checkbox 
                  checked={formData.workplace_adjustments.includes(adjustment.value)}
                  onCheckedChange={(checked) => handleArrayChange('workplace_adjustments', adjustment.value, checked as boolean)}
                />
                <span className="text-sm">{adjustment.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Employment Preferences */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.has_driving_licence === true}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_driving_licence: checked }))}
              />
              <span className="text-sm">Driving Licence</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.open_to_relocation === true}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, open_to_relocation: checked }))}
              />
              <span className="text-sm">Open to Relocation</span>
            </label>
          </div>
        </div>

        {/* Work Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Preferences
          </label>
          <div className="grid grid-cols-2 gap-2">
            {workPreferences.map((pref) => (
              <label key={pref.value} className="flex items-center space-x-2">
                <Checkbox 
                  checked={formData.work_preferences.includes(pref.value)}
                  onCheckedChange={(checked) => handleArrayChange('work_preferences', pref.value, checked as boolean)}
                />
                <span className="text-sm">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
