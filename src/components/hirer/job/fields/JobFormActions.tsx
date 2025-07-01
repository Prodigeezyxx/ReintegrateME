
import React from 'react';
import { Button } from '@/components/ui/button';

interface JobFormActionsProps {
  isSubmitting: boolean;
  onSaveDraft: () => void;
}

const JobFormActions: React.FC<JobFormActionsProps> = ({ isSubmitting, onSaveDraft }) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onSaveDraft}
        disabled={isSubmitting}
      >
        Save as Draft
      </Button>
      <Button
        type="submit"
        className="flex-1 bg-reme-orange hover:bg-orange-600 transition-colors"
        disabled={isSubmitting}
      >
        Post Job
      </Button>
    </div>
  );
};

export default JobFormActions;
