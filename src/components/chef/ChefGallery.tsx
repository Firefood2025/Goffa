
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Chef } from '@/pages/RentChefPage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChefGalleryProps {
  chef: Chef;
  onClose: () => void;
}

export const ChefGallery: React.FC<ChefGalleryProps> = ({ chef, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((prev) => (prev === chef.gallery.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? chef.gallery.length - 1 : prev - 1));
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {chef.name}'s Recipe Gallery
            <Badge variant="secondary" className="ml-2">
              {chef.specialties.join(', ')}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Discover {chef.name}'s culinary creations in {chef.styles.join(', ')} cuisine
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Main image display */}
          <div className="relative rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={chef.gallery[activeImage]} 
                alt={`${chef.name}'s dish ${activeImage + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Navigation arrows */}
              <Button 
                variant="outline"
                size="icon" 
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="outline"
                size="icon" 
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                {activeImage + 1} / {chef.gallery.length}
              </div>
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {chef.gallery.map((image, index) => (
              <div 
                key={index} 
                className={`aspect-video overflow-hidden rounded-md cursor-pointer border-2 ${
                  activeImage === index ? 'border-kitchen-green' : 'border-transparent'
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${chef.name}'s dish ${index + 1} (thumbnail)`} 
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
