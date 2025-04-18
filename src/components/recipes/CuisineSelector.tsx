
import React from 'react';
import { Button } from '@/components/ui/button';

export type Cuisine = 'Tunisian' | 'Oriental' | 'French' | 'Italian' | 'All';

interface CuisineSelectorProps {
  selectedCuisine: Cuisine;
  onSelect: (cuisine: Cuisine) => void;
}

const CuisineSelector: React.FC<CuisineSelectorProps> = ({ selectedCuisine, onSelect }) => {
  const cuisines: Cuisine[] = ['All', 'Tunisian', 'Oriental', 'French', 'Italian'];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {cuisines.map((cuisine) => (
        <Button
          key={cuisine}
          variant={selectedCuisine === cuisine ? "default" : "outline"}
          onClick={() => onSelect(cuisine)}
          className={selectedCuisine === cuisine ? 
            "bg-kitchen-green hover:bg-kitchen-green/90" : 
            "border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
          }
        >
          {cuisine}
        </Button>
      ))}
    </div>
  );
};

export default CuisineSelector;
