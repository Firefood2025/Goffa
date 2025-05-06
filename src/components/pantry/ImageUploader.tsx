
import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (imageData: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialImage, onImageChange }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mb-2">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm"
      >
        {previewImage ? (
          <div className="relative w-full h-full">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={previewImage} 
              alt="Image preview" 
              className="w-full h-full object-cover"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-90 hover:opacity-100"
              onClick={handleRemoveImage}
            >
              <X size={12} />
            </Button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon size={32} className="text-gray-400" />
          </div>
        )}
      </motion.div>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleTakePhoto} 
          className="text-xs"
        >
          <Camera size={14} className="mr-1" />
          Take Photo
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()} 
          className="text-xs"
        >
          <Upload size={14} className="mr-1" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          capture="environment"
        />
      </div>
    </div>
  );
};

export default ImageUploader;
