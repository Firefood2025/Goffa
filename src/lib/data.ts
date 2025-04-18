import { PantryItemData } from '@/components/pantry/PantryItem';
import { RecipeData } from '@/components/recipes/RecipeCard';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';

// Mock pantry data
export const mockPantryItems: PantryItemData[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    quantity: 2,
    unit: 'pcs',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    addedDate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Pasta',
    quantity: 1,
    unit: 'pkg',
    category: 'pantry',
    addedDate: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Tomatoes',
    quantity: 4,
    unit: 'pcs',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    addedDate: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Frozen Peas',
    quantity: 1,
    unit: 'bag',
    category: 'freezer',
    addedDate: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Milk',
    quantity: 1,
    unit: 'L',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    addedDate: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Bread',
    quantity: 1,
    unit: 'loaf',
    category: 'pantry',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    addedDate: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Eggs',
    quantity: 6,
    unit: 'pcs',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    addedDate: new Date().toISOString()
  }
];

// Mock recipe data
export const mockRecipes: RecipeData[] = [
  {
    id: '1',
    title: 'Tunisian Couscous with Vegetables',
    image: 'https://source.unsplash.com/random/800x600/?couscous,tunisian',
    cookTime: 45,
    ingredients: ['Couscous', 'Chickpeas', 'Carrots', 'Zucchini', 'Tomatoes', 'Harissa'],
    matchingIngredients: 3,
    difficulty: 'Medium',
    cuisine: 'Tunisian'
  },
  {
    id: '2',
    title: 'French Ratatouille',
    image: 'https://source.unsplash.com/random/800x600/?ratatouille,french',
    cookTime: 60,
    ingredients: ['Eggplant', 'Zucchini', 'Tomatoes', 'Bell Peppers', 'Onions', 'Herbs'],
    matchingIngredients: 2,
    difficulty: 'Medium',
    cuisine: 'French'
  },
  {
    id: '3',
    title: 'Oriental Shawarma',
    image: 'https://source.unsplash.com/random/800x600/?shawarma,middle-eastern',
    cookTime: 90,
    ingredients: ['Chicken', 'Pita Bread', 'Tahini', 'Garlic', 'Vegetables'],
    matchingIngredients: 2,
    difficulty: 'Hard',
    cuisine: 'Oriental'
  },
  {
    id: '4',
    title: 'Tunisian Shakshuka',
    image: 'https://source.unsplash.com/random/800x600/?shakshuka,eggs',
    cookTime: 25,
    ingredients: ['Eggs', 'Tomatoes', 'Bell Peppers', 'Onions', 'Spices'],
    matchingIngredients: 3,
    difficulty: 'Easy',
    cuisine: 'Tunisian'
  }
];

// Mock shopping list data
export const mockShoppingItems: ShoppingItemData[] = [
  {
    id: '1',
    name: 'Onions',
    quantity: 3,
    unit: 'pcs',
    category: 'Produce',
    isChecked: false
  },
  {
    id: '2',
    name: 'Garlic',
    quantity: 1,
    unit: 'bulb',
    category: 'Produce',
    isChecked: false
  },
  {
    id: '3',
    name: 'Chicken Stock',
    quantity: 1,
    unit: 'L',
    category: 'Canned & Packaged',
    isChecked: true
  },
  {
    id: '4',
    name: 'Parmesan Cheese',
    quantity: 200,
    unit: 'g',
    category: 'Dairy',
    isChecked: false,
    note: 'Get the grated one if available'
  },
  {
    id: '5',
    name: 'Arborio Rice',
    quantity: 1,
    unit: 'kg',
    category: 'Grains & Pasta',
    isChecked: false
  }
];

// Generate a list of expiring items for the home page
export const getExpiringSoonItems = (days: number = 7) => {
  return mockPantryItems
    .filter(item => {
      if (!item.expiryDate) return false;
      
      const today = new Date();
      const expiry = new Date(item.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= days;
    })
    .sort((a, b) => {
      const dateA = new Date(a.expiryDate!).getTime();
      const dateB = new Date(b.expiryDate!).getTime();
      return dateA - dateB;
    })
    .map(item => ({
      id: item.id,
      name: item.name,
      daysLeft: Math.ceil((new Date(item.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }));
};
