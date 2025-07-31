import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  className?: string;
  bucket: string;
  folder: string;
  placeholder?: string;
  allowedTypes?: string[];
  acceptMultipleTypes?: boolean;
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  className,
  bucket,
  folder,
  placeholder = "Upload a file",
  allowedTypes = ['image/*', 'application/pdf', 'video/*'],
  acceptMultipleTypes = true
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploading } = useFileUpload({
    bucket,
    folder,
    allowedTypes,
    maxSize: 10 * 1024 * 1024 // 10MB for content files
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Create preview for images only
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setPreview('file-placeholder');
    }
    
    // Upload file
    const url = await uploadFile(file);
    if (url) {
      onUpload(url);
    } else {
      // Reset preview on error
      setPreview(currentImage || null);
    }
    
    // Clean up preview URL if it was created
    if (file.type.startsWith('image/') && preview && preview !== 'file-placeholder') {
      URL.revokeObjectURL(preview);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptMultipleTypes ? allowedTypes.join(',') : 'image/*'}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
            {preview === 'file-placeholder' ? (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">File uploaded</p>
                </div>
              </div>
            ) : preview.startsWith('blob:') || preview.startsWith('http') ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">File uploaded</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-muted/50",
            dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
            uploading && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-primary">Uploading...</span>
              <span className="text-xs text-muted-foreground">Please wait</span>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-muted mb-4">
                {acceptMultipleTypes ? (
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <Film className="w-5 h-5 text-muted-foreground" />
                  </div>
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground mb-1">{placeholder}</p>
              <p className="text-xs text-muted-foreground mb-2">
                {acceptMultipleTypes 
                  ? "Images, PDFs, or videos • Drag and drop or click to select"
                  : "Drag and drop or click to select"
                }
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Browse
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}