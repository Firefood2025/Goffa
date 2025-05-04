
import React from 'react';
import { ChefCategory, ChefStyle } from '@/pages/RentChefPage';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChefFilterProps {
  selectedCategory: ChefCategory;
  onCategoryChange: (category: ChefCategory) => void;
  selectedStyle: ChefStyle;
  onStyleChange: (style: ChefStyle) => void;
}

export const ChefFilter: React.FC<ChefFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedStyle,
  onStyleChange
}) => {
  const categories: ChefCategory[] = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'event'];
  const styles: ChefStyle[] = ['all', 'Mexican', 'Italian', 'Healthy', 'Mediterranean', 'Asian', 'Meal Prep', 'Brunch'];
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-1">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                className={`capitalize ${selectedCategory === category ? "bg-kitchen-green hover:bg-kitchen-green/90" : ""}`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Culinary Styles</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-1">
            {styles.map((style) => (
              <Button
                key={style}
                size="sm"
                variant={selectedStyle === style ? "default" : "outline"}
                className={`${selectedStyle === style ? "bg-kitchen-green hover:bg-kitchen-green/90" : ""}`}
                onClick={() => onStyleChange(style)}
              >
                {style}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
