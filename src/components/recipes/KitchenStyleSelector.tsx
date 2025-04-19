
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export type KitchenStyle = 'Italian' | 'Asian' | 'Mediterranean' | 'Vegan' | 'Indian' | 'Mexican' | 'French' | 'Middle Eastern' | 'American' | 'Thai' | 'Japanese' | 'Korean' | 'All' | string;

interface KitchenStyleSelectorProps {
  selectedStyle: KitchenStyle;
  onSelect: (style: KitchenStyle) => void;
}

const KitchenStyleSelector: React.FC<KitchenStyleSelectorProps> = ({ 
  selectedStyle, 
  onSelect 
}) => {
  const [customStyle, setCustomStyle] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const predefinedStyles: KitchenStyle[] = [
    'All',
    'Italian',
    'Asian',
    'Mediterranean',
    'Vegan',
    'Indian',
    'Mexican',
    'French',
    'Middle Eastern',
    'American',
    'Thai',
    'Japanese',
    'Korean'
  ];

  const handleAddCustomStyle = () => {
    if (customStyle.trim()) {
      onSelect(customStyle.trim());
      setCustomStyle('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomStyle();
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-2 text-kitchen-dark">Kitchen Style</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {predefinedStyles.map((style) => (
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
        <Button
          variant="outline"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Custom Style
        </Button>
      </div>
      
      {showCustomInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom kitchen style"
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleAddCustomStyle}
            disabled={!customStyle.trim()}
            className="bg-kitchen-green hover:bg-kitchen-green/90"
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default KitchenStyleSelector;
