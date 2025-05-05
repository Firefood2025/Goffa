
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Chef } from '@/pages/RentChefPage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from 'framer-motion';

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
          {/* Main image display with Carousel */}
          <Carousel className="w-full">
            <CarouselContent>
              {chef.gallery.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative rounded-lg overflow-hidden">
                    <div className="aspect-video">
                      <motion.img 
                        initial={{ opacity: 0.8, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={image} 
                        alt={`${chef.name}'s dish ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          
          {/* Thumbnails with active state */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {chef.gallery.map((image, index) => (
              <motion.div 
                key={index} 
                className={`aspect-video overflow-hidden rounded-md cursor-pointer ${
                  activeImage === index ? 'ring-2 ring-kitchen-green' : 'ring-1 ring-gray-200'
                }`}
                onClick={() => setActiveImage(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={image} 
                  alt={`${chef.name}'s dish ${index + 1} (thumbnail)`} 
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    activeImage === index ? 'brightness-100' : 'brightness-90 hover:brightness-100'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
