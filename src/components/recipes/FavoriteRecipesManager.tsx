
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { RecipeData } from './RecipeCard';

interface FavoriteRecipesManagerProps {
  favoriteRecipes: string[];
  recipes: RecipeData[];
  onViewRecipe: (id: string) => void;
  onRemoveFavorite: (id: string) => void;
}

const FavoriteRecipesManager: React.FC<FavoriteRecipesManagerProps> = ({
  favoriteRecipes,
  recipes,
  onViewRecipe,
  onRemoveFavorite
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (favoriteRecipes.length === 0) {
    return null;
  }
  
  // Filter recipes based on favoriteRecipes IDs
  const favoriteRecipesList = recipes.filter(recipe => 
    favoriteRecipes.includes(recipe.id)
  );
  
  if (favoriteRecipesList.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
      <div className="p-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <Heart size={18} className="mr-2 text-red-500 fill-current" />
            <h3 className="font-bold text-lg text-kitchen-dark">
              Favorite Recipes ({favoriteRecipesList.length})
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-kitchen-green"
          >
            {isExpanded ? "Hide" : "Show"}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-3 animate-accordion-down">
            {favoriteRecipesList.map(recipe => (
              <div 
                key={recipe.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <img 
                    src={recipe.image || `https://source.unsplash.com/random/100x100/?food,${recipe.title.toLowerCase().replace(/\s+/g, ',')}`}
                    alt={recipe.title}
                    className="w-12 h-12 object-cover rounded-md mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-kitchen-dark">{recipe.title}</h4>
                    <p className="text-xs text-gray-500">{recipe.cuisine || 'Mixed cuisine'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(recipe.id);
                    }}
                  >
                    <Heart size={16} className="fill-current" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
                    onClick={() => onViewRecipe(recipe.id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteRecipesManager;
