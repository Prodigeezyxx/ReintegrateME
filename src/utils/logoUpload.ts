import { supabase } from "@/integrations/supabase/client";
import { imageStorageAPI } from "../services/storage";

export const uploadLogo = async (file: File): Promise<string | null> => {
  try {
    // First try Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase storage error:', error);
      // Fallback to browser storage
      const base64 = await imageStorageAPI.fileToBase64(file);
      const storageKey = `company_logo_${Date.now()}`;
      imageStorageAPI.storeImage(storageKey, base64);
      console.log('Stored logo in browser memory as fallback');
      return base64; // Return base64 directly for immediate use
    }

    // Get the public URL from Supabase
    const { data: urlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    
    // Final fallback to browser storage
    try {
      const base64 = await imageStorageAPI.fileToBase64(file);
      const storageKey = `company_logo_${Date.now()}`;
      imageStorageAPI.storeImage(storageKey, base64);
      console.log('Stored logo in browser memory as final fallback');
      return base64;
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
      return null;
    }
  }
};

export const uploadProfileImage = async (file: File): Promise<string | null> => {
  try {
    // First try Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase storage error:', error);
      // Fallback to browser storage
      const base64 = await imageStorageAPI.fileToBase64(file);
      const storageKey = `profile_image_${Date.now()}`;
      imageStorageAPI.storeImage(storageKey, base64);
      console.log('Stored profile image in browser memory as fallback');
      return base64;
    }

    // Get the public URL from Supabase
    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    
    // Final fallback to browser storage
    try {
      const base64 = await imageStorageAPI.fileToBase64(file);
      const storageKey = `profile_image_${Date.now()}`;
      imageStorageAPI.storeImage(storageKey, base64);
      console.log('Stored profile image in browser memory as final fallback');
      return base64;
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
      return null;
    }
  }
};

export const getLogoUrl = (): string => {
  return "/lovable-uploads/REMENEWLOGO.png";
};

export const getFallbackLogoUrl = (): string => {
  return "/lovable-uploads/354e6306-e216-4b62-9bbc-24433bcbcc1f.png";
};
