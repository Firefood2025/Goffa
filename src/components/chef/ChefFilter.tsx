
import React from 'react';
import { ChefCategory, ChefStyle } from '@/types/chef';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChefHat, Utensils, Coffee, Salad, Cake, PartyPopper } from 'lucide-react';

interface ChefFilterProps {
  selectedCategory: ChefCategory;
  onCategoryChange: (category: ChefCategory) => void;
  selectedStyle: ChefStyle;
  onStyleChange: (style: ChefStyle) => void;
}

// Icon mapping for categories
const categoryIcons = {
  all: ChefHat,
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Utensils,
  dessert: Cake,
  event: PartyPopper
};

export const ChefFilter: React.FC<ChefFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedStyle,
  onStyleChange
}) => {
  const categories: ChefCategory[] = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'event'];
  const styles: ChefStyle[] = ['all', 'Mexican', 'Italian', 'Healthy', 'Mediterranean', 'Asian', 'Meal Prep', 'Brunch'];
  
  // Helper function to get the icon for a category
  const getCategoryIcon = (category: ChefCategory) => {
    const IconComponent = categoryIcons[category] || ChefHat;
    return <IconComponent className="mr-1 h-4 w-4" />;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700">Meal Categories</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                className={`capitalize ${selectedCategory === category ? "bg-kitchen-green hover:bg-kitchen-green/90" : ""} py-6`}
                onClick={() => onCategoryChange(category)}
              >
                {getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700">Culinary Styles</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex flex-wrap gap-2 pb-2">
            {styles.map((style) => (
              <Button
                key={style}
                size="sm"
                variant={selectedStyle === style ? "default" : "outline"}
                className={`${selectedStyle === style ? "bg-kitchen-green hover:bg-kitchen-green/90" : ""}`}
                onClick={() => onStyleChange(style)}
              >
                <Salad className="mr-1 h-4 w-4" />
                {style}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
