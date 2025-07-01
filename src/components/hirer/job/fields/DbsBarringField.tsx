
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

interface DbsBarringFieldProps {
  subjectToDbsBarring: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const DbsBarringField: React.FC<DbsBarringFieldProps> = ({ subjectToDbsBarring, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="subjectToDbsBarring"
          name="subjectToDbsBarring"
          checked={subjectToDbsBarring}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: 'subjectToDbsBarring',
                type: 'checkbox',
                checked: !!checked
              }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }}
        />
        <Label htmlFor="subjectToDbsBarring" className="text-sm font-medium cursor-pointer">
          Subject to DBS Barring
        </Label>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-xs text-gray-600 ml-6">
        Check this box if the role involves regulated activities requiring DBS barring checks. 
        This typically applies to positions working with children or vulnerable adults.
      </p>
    </div>
  );
};

export default DbsBarringField;
