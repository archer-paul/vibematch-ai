import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadProps {
  bucket: string;
  folder: string;
  allowedTypes?: string[];
  maxSize?: number;
}

export function useFileUpload({ 
  bucket, 
  folder, 
  allowedTypes = ['image/*', 'application/pdf', 'video/*'],
  maxSize = 10 * 1024 * 1024 // 10MB default
}: UseFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<string | null> => {
    // Validate file type
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast({
        variant: "destructive",
        title: "File type not allowed",
        description: `Allowed types: ${allowedTypes.join(', ')}`
      });
      return null;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`
      });
      return null;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload error",
        description: "Unable to upload file"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
}