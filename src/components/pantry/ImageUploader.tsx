
import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-col items-center gap-3 mb-4">
      <AnimatePresence mode="wait">
        <motion.div 
          key={previewImage ? 'image' : 'placeholder'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm"
        >
          {previewImage ? (
            <div className="relative w-full h-full">
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex items-center justify-center bg-gray-100 flex-col gap-2"
            >
              <ImageIcon size={32} className="text-gray-400" />
              <span className="text-xs text-gray-400">Add Image</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <div className="flex flex-wrap justify-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
        </motion.div>
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
