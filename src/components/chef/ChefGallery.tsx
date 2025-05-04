
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chef } from '@/pages/RentChefPage';

interface ChefGalleryProps {
  chef: Chef;
  onClose: () => void;
}

export const ChefGallery: React.FC<ChefGalleryProps> = ({ chef, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{chef.name}'s Recipe Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {chef.gallery.map((image, index) => (
            <div key={index} className="aspect-video overflow-hidden rounded-md">
              <img 
                src={image} 
                alt={`${chef.name}'s dish ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
