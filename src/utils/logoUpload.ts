
import { supabase } from "@/integrations/supabase/client";

export const uploadLogo = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `reintegrateme-logo.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading logo:', error);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    return null;
  }
};

export const getLogoUrl = (): string => {
  // Use your uploaded ReintegrateMe logo
  return "/lovable-uploads/f889463a-1a57-46ae-a265-de47534c3ace.png";
};
