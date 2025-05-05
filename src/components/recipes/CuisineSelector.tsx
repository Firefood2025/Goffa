
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export type Cuisine = 'Tunisian' | 'Oriental' | 'French' | 'Italian' | 'All';

interface CuisineSelectorProps {
  selectedCuisine: Cuisine;
  onSelect: (cuisine: Cuisine) => void;
}

const CuisineSelector: React.FC<CuisineSelectorProps> = ({ selectedCuisine, onSelect }) => {
  const cuisines: Cuisine[] = ['All', 'Tunisian', 'Oriental', 'French', 'Italian'];
  const isMobile = useIsMobile();

  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4 mb-4">
      <div className={`flex gap-2 ${isMobile ? 'w-max' : 'flex-wrap'}`}>
        {cuisines.map((cuisine) => (
          <Button
            key={cuisine}
            variant={selectedCuisine === cuisine ? "default" : "outline"}
            onClick={() => onSelect(cuisine)}
            className={`${selectedCuisine === cuisine ? 
              "bg-kitchen-green hover:bg-kitchen-green/90" : 
              "border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            } ${isMobile ? 'flex-shrink-0' : ''}`}
          >
            {cuisine}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CuisineSelector;
