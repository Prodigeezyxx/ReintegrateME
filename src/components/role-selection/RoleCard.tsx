
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleCardProps {
  role: 'seeker' | 'hirer';
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  colorScheme: 'blue' | 'orange';
  onSelect: (role: 'seeker' | 'hirer') => void;
  isNavigating: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  description,
  buttonText,
  icon,
  colorScheme,
  onSelect,
  isNavigating
}) => {
  const colors = {
    blue: {
      border: 'hover:border-blue-300',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    orange: {
      border: 'hover:border-orange-300',
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700'
    }
  };

  const colorConfig = colors[colorScheme];

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${colorConfig.border}`} 
      onClick={() => onSelect(role)}
    >
      <CardHeader className="text-center">
        <div className={`h-12 w-12 mx-auto mb-2 rounded-full ${colorConfig.bg} flex items-center justify-center`}>
          {icon}
        </div>
        <CardTitle className={colorConfig.text}>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className={`w-full ${colorConfig.button}`} 
          onClick={() => onSelect(role)}
          disabled={isNavigating}
        >
          {isNavigating ? 'Loading...' : buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
