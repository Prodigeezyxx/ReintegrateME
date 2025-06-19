
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageCircle, Phone } from 'lucide-react';

const HelpSection: React.FC = () => {
  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader className="text-center pb-3">
        <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
          <HelpCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-green-600">Need Help?</CardTitle>
        <CardDescription className="text-green-700">
          Get support and guidance for your reintegration journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
            onClick={() => window.open('tel:1-800-REME-HELP', '_blank')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Support
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
            onClick={() => window.open('mailto:support@reintegrateme.com', '_blank')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Email Us
          </Button>
        </div>
        <div className="text-xs text-green-600 text-center space-y-1">
          <p><strong>Support Hours:</strong> Mon-Fri 9AM-6PM EST</p>
          <p><strong>Crisis Line:</strong> Available 24/7</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpSection;
