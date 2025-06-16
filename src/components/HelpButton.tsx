
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, MessageCircle, Mail } from 'lucide-react';

const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg bg-white border-2 border-reme-orange hover:bg-orange-50"
        >
          <HelpCircle className="h-6 w-6 text-reme-orange" />
          <span className="sr-only">Need help?</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Need Help?</DialogTitle>
          <DialogDescription>
            We're here to help you get started with ReME. Choose how you'd like to get support.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // In a real app, this would open a chat widget
              alert('Chat support coming soon!');
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Live Chat Support
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              window.location.href = 'mailto:support@reme.com?subject=Help with ReME App';
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Support
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpButton;
