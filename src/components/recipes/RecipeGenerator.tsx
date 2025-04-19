
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Utensils, ChefHat } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface RecipeGeneratorProps {
  onGenerate: (ingredients: string[]) => Promise<void>;
  isGenerating: boolean;
  kitchenStyle: string;
}

const commonIngredients = [
  'Chicken', 'Beef', 'Pork', 'Tomatoes', 'Onions', 
  'Garlic', 'Rice', 'Pasta', 'Potatoes', 'Carrots',
  'Broccoli', 'Spinach', 'Eggs', 'Milk', 'Cheese'
];

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ 
  onGenerate, 
  isGenerating,
  kitchenStyle
}) => {
  const { toast } = useToast();
  const [customIngredient, setCustomIngredient] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(item => item !== ingredient) 
        : [...prev, ingredient]
    );
  };

  const handleAddCustomIngredient = () => {
    if (!customIngredient.trim()) return;
    
    if (!selectedIngredients.includes(customIngredient)) {
      setSelectedIngredients(prev => [...prev, customIngredient]);
      setCustomIngredient('');
    } else {
      toast({
        title: "Ingredient already added",
        description: "This ingredient is already in your list",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleGenerateClick = async () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    await onGenerate(selectedIngredients);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <ChefHat className="mr-2 text-kitchen-green" size={20} />
        Recipe Generator ({kitchenStyle} Style)
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Add ingredients from your pantry:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {commonIngredients.map(ingredient => (
            <div key={ingredient} className="flex items-center space-x-2">
              <Checkbox 
                id={`ingredient-${ingredient}`} 
                checked={selectedIngredients.includes(ingredient)}
                onCheckedChange={() => handleIngredientToggle(ingredient)}
              />
              <label 
                htmlFor={`ingredient-${ingredient}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {ingredient}
              </label>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Input 
            placeholder="Add custom ingredient" 
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomIngredient()}
          />
          <Button 
            onClick={handleAddCustomIngredient}
            variant="outline"
          >
            Add
          </Button>
        </div>
      </div>
      
      {selectedIngredients.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Selected ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map(ingredient => (
              <div 
                key={ingredient} 
                className="bg-muted px-3 py-1 rounded-full text-xs flex items-center"
              >
                {ingredient}
                <button 
                  onClick={() => handleIngredientToggle(ingredient)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleGenerateClick} 
        className="w-full bg-kitchen-green hover:bg-kitchen-green/90"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center">
            <div className="animate-spin mr-2">
              <Utensils size={16} />
            </div>
            Cooking up your recipe...
          </div>
        ) : (
          <>Generate Recipe</>
        )}
      </Button>
    </div>
  );
};

export default RecipeGenerator;
