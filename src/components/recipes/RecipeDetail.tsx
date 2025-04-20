
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat, Utensils, Share2, Copy, CheckCircle, ShoppingCart, Plus, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export interface GeneratedRecipe {
  id?: string;
  title: string;
  cookTime: number;
  ingredients: string[];
  measurements?: string[];
  steps: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tagline: string;
  image?: string;
  cuisine?: string;
  category?: string;
  tags?: string[];
}

interface RecipeDetailProps {
  recipe: GeneratedRecipe;
  onTryAnother: () => void;
  kitchenStyle: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, 
  onTryAnother,
  kitchenStyle,
  isFavorite = false,
  onToggleFavorite
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [missingIngredients, setMissingIngredients] = useState<{ingredient: string, measurement?: string}[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        if (supabase) {
          const { data } = await supabase
            .from('pantry_items')
            .select('name');
          
          if (data) {
            const itemNames = data.map(item => item.name.toLowerCase());
            setPantryItems(itemNames);
            
            // Identify missing ingredients
            const missing = recipe.ingredients
              .filter(ingredient => !itemNames.includes(ingredient.toLowerCase()))
              .map((ingredient, index) => ({
                ingredient,
                measurement: recipe.measurements?.[index]
              }));
              
            setMissingIngredients(missing);
          }
        }
      } catch (error) {
        console.error('Error fetching pantry items:', error);
      }
    };
    
    fetchPantryItems();
  }, [recipe]);

  const createShareText = () => {
    const ingredientsList = recipe.ingredients.map((i, index) => {
      const measurement = recipe.measurements?.[index] ? `${recipe.measurements[index]} ` : '';
      return `• ${measurement}${i}`;
    }).join('\n');
    
    const stepsList = recipe.steps.map((s, i) => `${i+1}. ${s}`).join('\n');
    
    return `🍽️ ${recipe.title} 🍽️\n\n${recipe.tagline}\n\nCooking Time: ${recipe.cookTime} min\nStyle: ${recipe.cuisine || kitchenStyle}\n\n📋 INGREDIENTS:\n${ingredientsList}\n\n📝 INSTRUCTIONS:\n${stepsList}`;
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

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addToShoppingList = async () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select ingredients to add to your shopping list",
        variant: "destructive",
      });
      return;
    }

    try {
      if (supabase) {
        // Get current shopping list to avoid duplicates
        const { data: existingItems } = await supabase
          .from('shopping_list')
          .select('name');
        
        const existingNames = existingItems?.map(item => item.name.toLowerCase()) || [];
        
        // Filter out any ingredients already in the shopping list
        const newIngredients = selectedIngredients.filter(
          ingredient => !existingNames.includes(ingredient.toLowerCase())
        );
        
        if (newIngredients.length > 0) {
          // Add new ingredients to shopping list
          const { error } = await supabase
            .from('shopping_list')
            .insert(
              newIngredients.map(ingredient => ({
                name: ingredient,
                category: 'Recipe Ingredients',
                quantity: '1',
                isChecked: false
              }))
            );
          
          if (error) throw error;
          
          toast({
            title: "Added to shopping list",
            description: `${newIngredients.length} ingredient${newIngredients.length > 1 ? 's' : ''} added to your shopping list`,
          });
          
          // Navigate to shopping list page
          navigate('/shopping-list');
        } else {
          toast({
            title: "Ingredients already in list",
            description: "All selected ingredients are already in your shopping list",
          });
        }
      } else {
        // Fallback for when Supabase is not available
        toast({
          title: "Added to shopping list",
          description: `${selectedIngredients.length} ingredient${selectedIngredients.length > 1 ? 's' : ''} would be added to your shopping list`,
        });
        navigate('/shopping-list');
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      toast({
        title: "Couldn't add to shopping list",
        description: "There was an error adding ingredients to your shopping list",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 animate-fade-in">
      <div className="p-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-center text-kitchen-dark mb-1">
            ✨ Recipe Details
          </h2>
        </div>
        
        <div className="mb-6 relative">
          <h1 className="text-2xl font-bold mb-2 text-kitchen-green">{recipe.title}</h1>
          <p className="text-gray-600 italic">{recipe.tagline}</p>
          
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`absolute top-0 right-0 p-2 rounded-full ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
              } hover:scale-110 transition-transform`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            </button>
          )}
          
          {recipe.image && (
            <div className="my-4">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-48 object-cover rounded-md"
                onError={(e) => {
                  // Fallback image if the main one fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://source.unsplash.com/random/800x600/?food,${recipe.title.toLowerCase().replace(/\s+/g, ',')}`;
                }}
              />
            </div>
          )}
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mt-3">
            <Clock size={16} className="mr-1 text-kitchen-green" />
            <span className="mr-2">{recipe.cookTime} min</span>
            
            {recipe.cuisine && (
              <>
                <span className="mx-1">•</span>
                <ChefHat size={16} className="mr-1 ml-1 text-kitchen-green" />
                <span className="mr-2">{recipe.cuisine} Cuisine</span>
              </>
            )}
            
            {recipe.category && (
              <>
                <span className="mx-1">•</span>
                <span className="px-2 py-1 bg-muted text-xs rounded-full">{recipe.category}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Utensils size={16} className="mr-2 text-kitchen-green" />
            Ingredients
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => {
              const measurement = recipe.measurements?.[index] ? `${recipe.measurements[index]} ` : '';
              const isInPantry = pantryItems.some(item => 
                ingredient.toLowerCase().includes(item) || 
                item.includes(ingredient.toLowerCase())
              );
              
              return (
                <li key={index} className={`${isInPantry ? 'text-gray-700' : 'text-orange-500 font-medium'}`}>
                  {measurement}{ingredient}
                  {!isInPantry && ' (not in pantry)'}
                </li>
              );
            })}
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
        
        {missingIngredients.length > 0 && (
          <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 flex items-center text-orange-700">
              <ShoppingCart size={16} className="mr-2" />
              Missing Ingredients
            </h3>
            
            <ul className="space-y-2">
              {missingIngredients.map((item, index) => (
                <li key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`missing-${index}`}
                    checked={selectedIngredients.includes(item.ingredient)}
                    onChange={() => toggleIngredient(item.ingredient)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-kitchen-green focus:ring-kitchen-green"
                  />
                  <label htmlFor={`missing-${index}`} className="text-sm">
                    {item.measurement ? `${item.measurement} ` : ''}{item.ingredient}
                  </label>
                </li>
              ))}
            </ul>
            
            <Button
              onClick={addToShoppingList}
              disabled={selectedIngredients.length === 0}
              className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white"
              size="sm"
            >
              <Plus size={16} className="mr-1" />
              Add Selected to Shopping List
            </Button>
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
