
import React from 'react';
import { Button } from '@/components/ui/button';

export type KitchenStyle = 'Italian' | 'Asian' | 'Mediterranean' | 'Vegan' | 'All';

interface KitchenStyleSelectorProps {
  selectedStyle: KitchenStyle;
  onSelect: (style: KitchenStyle) => void;
}

const KitchenStyleSelector: React.FC<KitchenStyleSelectorProps> = ({ 
  selectedStyle, 
  onSelect 
}) => {
  const styles: KitchenStyle[] = ['All', 'Italian', 'Asian', 'Mediterranean', 'Vegan'];

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-2 text-kitchen-dark">Kitchen Style</h3>
      <div className="flex flex-wrap gap-2">
        {styles.map((style) => (
          <Button
            key={style}
            variant={selectedStyle === style ? "default" : "outline"}
            onClick={() => onSelect(style)}
            className={selectedStyle === style ? 
              "bg-kitchen-green hover:bg-kitchen-green/90" : 
              "border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            }
          >
            {style}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default KitchenStyleSelector;
