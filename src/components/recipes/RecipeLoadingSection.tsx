
import React from 'react';
import LoadingAnimation from '@/components/recipes/LoadingAnimation';
import FavoriteRecipesManager from '@/components/recipes/FavoriteRecipesManager';
import CuisineSelector from '@/components/recipes/CuisineSelector';
import RecipeList from '@/components/recipes/RecipeList';
import { RecipeData } from '@/components/recipes/RecipeCard';
import { Cuisine } from '@/components/recipes/CuisineSelector';

interface RecipeLoadingSectionProps {
  isLoading: boolean;
  recipes: RecipeData[];
  favoriteRecipes: string[];
  selectedCuisine: Cuisine;
  handleCuisineSelect: (cuisine: Cuisine) => void;
  handleFilterClick: () => void;
  handleRecipeClick: (id: string) => void;
  toggleFavorite: (recipeId: string) => void;
  deleteRecipe: (recipeId: string) => void;
}

const RecipeLoadingSection: React.FC<RecipeLoadingSectionProps> = ({
  isLoading,
  recipes,
  favoriteRecipes,
  selectedCuisine,
  handleCuisineSelect,
  handleFilterClick,
  handleRecipeClick,
  toggleFavorite,
  deleteRecipe
}) => {
  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {recipes.length > 0 && (
            <FavoriteRecipesManager
              favoriteRecipes={favoriteRecipes}
              recipes={recipes}
              onViewRecipe={handleRecipeClick}
              onRemoveFavorite={toggleFavorite}
            />
          )}
          
          <CuisineSelector
            selectedCuisine={selectedCuisine}
            onSelect={handleCuisineSelect}
          />
          
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <RecipeList
              recipes={recipes}
              onRecipeClick={handleRecipeClick}
              onFilterClick={handleFilterClick}
              favoriteRecipes={favoriteRecipes}
              onToggleFavorite={toggleFavorite}
              onDeleteRecipe={deleteRecipe}
              isLoading={false}
            />
          )}
        </>
      )}
    </>
  );
};

export default RecipeLoadingSection;
