
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '../models/types';
import { toast } from '@/hooks/use-toast';

interface SocialAuthButtonProps {
  provider: 'google' | 'linkedin_oidc';
  role?: UserRole;
  children: React.ReactNode;
  className?: string;
}

const SocialAuthButton = ({ provider, role, children, className }: SocialAuthButtonProps) => {
  const handleSocialAuth = async () => {
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          data: {
            role: role || 'seeker',
            provider: provider
          }
        }
      });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full py-3 ${className}`}
      onClick={handleSocialAuth}
    >
      {children}
    </Button>
  );
};

export default SocialAuthButton;
