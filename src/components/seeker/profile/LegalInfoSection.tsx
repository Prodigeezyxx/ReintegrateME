import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield } from 'lucide-react';

interface LegalInfoSectionProps {
  profile: any;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
}

const convictionTypes = [
  { value: 'theft_burglary_robbery', label: 'Theft / Burglary / Robbery' },
  { value: 'fraud_financial', label: 'Fraud / Financial Offences' },
  { value: 'drug_possession', label: 'Drug Offences (possession)' },
  { value: 'drug_supply_production', label: 'Drug Offences (supply / production)' },
  { value: 'driving_offences', label: 'Driving Offences' },
  { value: 'assault_violent', label: 'Assault / Violent Offences' },
  { value: 'sexual_offences', label: 'Sexual Offences' },
  { value: 'public_order', label: 'Public Order Offences' },
  { value: 'domestic_abuse', label: 'Domestic Abuse Related Offence' },
  { value: 'terrorism_related', label: 'Terrorism-Related Offences' },
  { value: 'weapons_offences', label: 'Weapons Offences' },
  { value: 'harassment_stalking', label: 'Harassment / Stalking' },
  { value: 'arson', label: 'Arson' },
  { value: 'breach_court_orders', label: 'Breach of Court Orders' },
  { value: 'other', label: 'Other' }
];

const supervisionTypes = [
  { value: 'probation', label: 'Probation' },
  { value: 'parole', label: 'Parole' },
  { value: 'community_sentence', label: 'Community Sentence' },
  { value: 'licence', label: 'Licence' },
  { value: 'mappa_oversight', label: 'MAPPA Oversight' },
  { value: 'none', label: 'None' }
];

export const LegalInfoSection: React.FC<LegalInfoSectionProps> = ({
  profile,
  isEditing,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    sentence_completed: profile.sentence_completed,
    current_legal_supervision: profile.current_legal_supervision || 'none',
    conviction_types: profile.conviction_types || [],
    conviction_status: profile.conviction_status || 'unspent',
    conviction_other_details: profile.conviction_other_details || '',
    barred_from_regulated_work: profile.barred_from_regulated_work,
    on_dbs_barring_list: profile.on_dbs_barring_list,
    mappa_level: profile.mappa_level || 'not_applicable',
    relevant_for_safeguarding_checks: profile.relevant_for_safeguarding_checks
  });

  const handleSave = () => {
    onUpdate(formData);
  };

  const handleConvictionTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...formData.conviction_types, type]
      : formData.conviction_types.filter((t: string) => t !== type);
    setFormData(prev => ({ ...prev, conviction_types: newTypes }));
  };

  if (!isEditing) {
    return (
      <Card className="ios-card">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <CardTitle>Legal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Sentence Status:</strong> {formData.sentence_completed ? 'Completed' : 'Not Completed'}</p>
            <p><strong>Current Supervision:</strong> {supervisionTypes.find(s => s.value === formData.current_legal_supervision)?.label || 'Not specified'}</p>
            <p><strong>Conviction Status:</strong> {formData.conviction_status}</p>
            {formData.conviction_types.length > 0 && (
              <div>
                <strong>Conviction Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {formData.conviction_types.map((type: string) => (
                    <li key={type}>
                      {convictionTypes.find(ct => ct.value === type)?.label}
                    </li>
                  ))}
                </ul>
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
        <Shield className="h-5 w-5 text-blue-600 mr-2" />
        <CardTitle>Legal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sentence Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sentence Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.sentence_completed === true}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sentence_completed: checked }))}
              />
              <span>Sentence Completed</span>
            </label>
          </div>
        </div>

        {/* Current Legal Supervision */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Legal Supervision
          </label>
          <div className="grid grid-cols-2 gap-2">
            {supervisionTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-2">
                <Checkbox 
                  checked={formData.current_legal_supervision === type.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData(prev => ({ ...prev, current_legal_supervision: type.value }));
                    }
                  }}
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Conviction Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conviction Type (select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {convictionTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-2">
                <Checkbox 
                  checked={formData.conviction_types.includes(type.value)}
                  onCheckedChange={(checked) => handleConvictionTypeChange(type.value, checked as boolean)}
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Details */}
        {formData.conviction_types.includes('other') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Conviction Details
            </label>
            <Textarea 
              placeholder="Please specify other conviction types..."
              value={formData.conviction_other_details}
              onChange={(e) => setFormData(prev => ({ ...prev, conviction_other_details: e.target.value }))}
              rows={3}
            />
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
