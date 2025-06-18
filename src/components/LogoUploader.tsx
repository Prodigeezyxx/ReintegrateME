
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadLogo } from '../utils/logoUpload';

const LogoUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const logoUrl = await uploadLogo(file);
      if (logoUrl) {
        setUploadResult(`Logo uploaded successfully! URL: ${logoUrl}`);
      } else {
        setUploadResult('Failed to upload logo');
      }
    } catch (error) {
      setUploadResult('Error uploading logo');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Logo to Supabase</h2>
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {isUploading && (
          <Button disabled className="w-full">
            Uploading...
          </Button>
        )}
        {uploadResult && (
          <p className={`text-sm ${uploadResult.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {uploadResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default LogoUploader;
