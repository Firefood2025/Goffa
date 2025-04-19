
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat, Utensils, Share2, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface GeneratedRecipe {
  title: string;
  cookTime: number;
  ingredients: string[];
  steps: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tagline: string;
}

interface RecipeDetailProps {
  recipe: GeneratedRecipe;
  onTryAnother: () => void;
  kitchenStyle: string;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, 
  onTryAnother,
  kitchenStyle
}) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  const createShareText = () => {
    const ingredientsList = recipe.ingredients.map(i => `• ${i}`).join('\n');
    const stepsList = recipe.steps.map((s, i) => `${i+1}. ${s}`).join('\n');
    
    return `🍽️ ${recipe.title} 🍽️\n\n${recipe.tagline}\n\nCooking Time: ${recipe.cookTime} min\nStyle: ${kitchenStyle}\n\n📋 INGREDIENTS:\n${ingredientsList}\n\n📝 INSTRUCTIONS:\n${stepsList}`;
  };

  const handleShare = async () => {
    const shareText = createShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: shareText,
        });
        toast({
          title: "Shared successfully!",
          description: "Recipe has been shared",
        });
      } else {
        // Fallback to copy to clipboard
        handleCopyToClipboard();
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // If sharing fails, fall back to clipboard
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = async () => {
    const shareText = createShareText();
    
    setCopying(true);
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Recipe has been copied and is ready to share",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Couldn't copy automatically",
        description: "Please select and copy the recipe manually",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setCopying(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 animate-fade-in">
      <div className="p-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-center text-kitchen-dark mb-1">
            ✨ Voilà! Your custom recipe is ready!
          </h2>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-kitchen-green">{recipe.title}</h1>
          <p className="text-gray-600 italic">{recipe.tagline}</p>
          
          <div className="flex items-center text-sm text-gray-600 mt-3">
            <Clock size={16} className="mr-1 text-kitchen-green" />
            <span>{recipe.cookTime} min</span>
            <span className="mx-2">•</span>
            <ChefHat size={16} className="mr-1 text-kitchen-green" />
            <span>{kitchenStyle} Style</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Utensils size={16} className="mr-2 text-kitchen-green" />
            Ingredients
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.steps.map((step, index) => (
              <li key={index} className="text-gray-700">{step}</li>
            ))}
          </ol>
        </div>
        
        {recipe.nutrition && (
          <div className="mb-6 p-3 bg-muted rounded-lg">
            <h3 className="text-sm font-semibold mb-1">Nutrition Info (estimated)</h3>
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              {recipe.nutrition.calories && (
                <div>
                  <div className="font-bold">{recipe.nutrition.calories}</div>
                  <div className="text-gray-500">Calories</div>
                </div>
              )}
              {recipe.nutrition.protein && (
                <div>
                  <div className="font-bold">{recipe.nutrition.protein}g</div>
                  <div className="text-gray-500">Protein</div>
                </div>
              )}
              {recipe.nutrition.carbs && (
                <div>
                  <div className="font-bold">{recipe.nutrition.carbs}g</div>
                  <div className="text-gray-500">Carbs</div>
                </div>
              )}
              {recipe.nutrition.fat && (
                <div>
                  <div className="font-bold">{recipe.nutrition.fat}g</div>
                  <div className="text-gray-500">Fat</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button 
            variant="default" 
            className="flex-1 bg-kitchen-green hover:bg-kitchen-green/90"
            onClick={onTryAnother}
          >
            Try Another
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            onClick={handleShare}
          >
            {copying ? (
              <>
                <CheckCircle size={16} className="mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={16} className="mr-1" />
                Save & Share
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
