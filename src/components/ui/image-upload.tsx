
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (url: string | null) => void;
  bucketName: 'profile-images' | 'company-logos';
  uploadPath: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  showRemove?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  bucketName,
  uploadPath,
  className = '',
  size = 'md',
  placeholder,
  showRemove = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create file name with timestamp to avoid conflicts
      const fileExt = file.name.split('.').pop();
      const fileName = `${uploadPath}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);

      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully"
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="relative">
        {bucketName === 'profile-images' ? (
          <Avatar className={`${sizeClasses[size]} cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors`} onClick={triggerFileSelect}>
            <AvatarImage src={previewUrl || ''} />
            <AvatarFallback className="bg-gray-50">
              {isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              ) : (
                <Camera className="h-6 w-6 text-gray-400" />
              )}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div 
            className={`${sizeClasses[size]} cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden`}
            onClick={triggerFileSelect}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Logo preview" className="w-full h-full object-contain" />
            ) : isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            ) : (
              <Upload className="h-6 w-6 text-gray-400" />
            )}
          </div>
        )}
        
        {previewUrl && showRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="text-xs"
        >
          {isUploading ? 'Uploading...' : previewUrl ? 'Change Image' : 'Upload Image'}
        </Button>
        {placeholder && (
          <p className="text-xs text-gray-500 mt-1">{placeholder}</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
