
import React from "react";
import KitchenStyleSelector, { KitchenStyle } from '@/components/recipes/KitchenStyleSelector';
import RecipeGenerator from '@/components/recipes/RecipeGenerator';
import RecipeDetail, { GeneratedRecipe } from '@/components/recipes/RecipeDetail';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

interface RecipeGeneratorContainerProps {
  showGenerator: boolean;
  setShowGenerator: (b: boolean) => void;
  selectedStyle: KitchenStyle;
  setSelectedStyle: (style: KitchenStyle) => void;
  generatedRecipe: GeneratedRecipe | null;
  setGeneratedRecipe: (recipe: GeneratedRecipe | null) => void;
  selectedRecipe: GeneratedRecipe | null;
  setSelectedRecipe: (recipe: GeneratedRecipe | null) => void;
  isGenerating: boolean;
  generateRecipe: (ingredients: string[]) => Promise<void>;
  handleTryAnother: () => void;
  favoriteRecipes: string[];
  onToggleFavorite: (id: string) => void;
}

const RecipeGeneratorContainer: React.FC<RecipeGeneratorContainerProps> = ({
  showGenerator,
  setShowGenerator,
  selectedStyle,
  setSelectedStyle,
  generatedRecipe,
  setGeneratedRecipe,
  selectedRecipe,
  setSelectedRecipe,
  isGenerating,
  generateRecipe,
  handleTryAnother,
  favoriteRecipes,
  onToggleFavorite,
}) => {
  return (
    <div>
      <Button
        onClick={() => {
          setShowGenerator(!showGenerator);
          if (!showGenerator) {
            setGeneratedRecipe(null);
            setSelectedRecipe(null);
          }
        }}
        className="w-full bg-kitchen-green hover:bg-kitchen-green/90 mb-4"
      >
        {showGenerator ? (
          <>Browse Recipe Ideas</>
        ) : (
          <>
            <Utensils className="mr-2" size={18} />
            Generate Recipes from Pantry
          </>
        )}
      </Button>
      
      {showGenerator && (
        <div>
          {selectedRecipe ? (
            <RecipeDetail
              recipe={selectedRecipe}
              onTryAnother={handleTryAnother}
              kitchenStyle={selectedStyle}
              isFavorite={selectedRecipe.id ? favoriteRecipes.includes(selectedRecipe.id) : false}
              onToggleFavorite={() => selectedRecipe.id && onToggleFavorite(selectedRecipe.id)}
            />
          ) : generatedRecipe ? (
            <RecipeDetail
              recipe={generatedRecipe}
              onTryAnother={handleTryAnother}
              kitchenStyle={selectedStyle}
              isFavorite={generatedRecipe.id ? favoriteRecipes.includes(generatedRecipe.id) : false}
              onToggleFavorite={() => generatedRecipe.id && onToggleFavorite(generatedRecipe.id)}
            />
          ) : (
            <>
              <KitchenStyleSelector
                selectedStyle={selectedStyle}
                onSelect={setSelectedStyle}
              />
              <RecipeGenerator
                onGenerate={generateRecipe}
                isGenerating={isGenerating}
                kitchenStyle={selectedStyle}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeGeneratorContainer;
