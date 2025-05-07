
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoppingList from '@/components/shopping/ShoppingList';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';

import { mockShoppingItems } from '@/lib/data';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const ShoppingListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>(mockShoppingItems);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch items from Supabase if available
  useEffect(() => {
    const fetchShoppingItems = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('shopping_list')
            .select('*');
          
          if (error) throw error;
          
          if (data) {
            setShoppingItems(data as ShoppingItemData[]);
          }
        } else {
          // Use mock data as fallback
          setShoppingItems(mockShoppingItems);
        }
      } catch (error) {
        console.error('Error fetching shopping items:', error);
        toast({
          title: 'Failed to load shopping list',
          description: 'Using demo data instead',
          variant: 'destructive',
        });
        setShoppingItems(mockShoppingItems);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShoppingItems();
  }, [toast]);
  
  // Handler functions
  const handleToggle = async (id: string) => {
    try {
      // Find the item to toggle
      const item = shoppingItems.find(item => item.id === id);
      if (!item) return;
      
      const updatedItem = { ...item, isChecked: !item.isChecked };
      
      // Optimistic UI update
      setShoppingItems(items =>
        items.map(item =>
          item.id === id ? updatedItem : item
        )
      );
      
      // Update in database if Supabase is available
      if (supabase) {
        const { error } = await supabase
          .from('shopping_list')
          .update({ isChecked: updatedItem.isChecked })
          .eq('id', id);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      toast({
        title: 'Failed to update item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update on error
      setShoppingItems(items =>
        items.map(item =>
          item.id === id ? { ...item, isChecked: !item.isChecked } : item
        )
      );
    }
  };
  
  const handleDelete = async (id: string) => {
    // Define deletedItem outside the try-catch block so it's accessible in both blocks
    let deletedItem: ShoppingItemData | undefined;
    
    try {
      // Store the item to be deleted before removing it from the state
      deletedItem = shoppingItems.find(item => item.id === id);
      
      // Optimistic UI update
      setShoppingItems(items => items.filter(item => item.id !== id));
      
      // Delete from database if Supabase is available
      if (supabase) {
        const { error } = await supabase
          .from('shopping_list')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your shopping list",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Failed to delete item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update on error if we have the deletedItem
      if (deletedItem) {
        setShoppingItems(prev => [...prev, deletedItem as ShoppingItemData]);
      }
    }
  };
  
  const handleAddNew = async () => {
    // Create a new item 
    const newItem: ShoppingItemData = {
      id: `new-${Date.now()}`,
      name: 'New Item',
      quantity: 1,
      unit: 'pc',
      category: 'General',
      isChecked: false,
      note: 'Click to edit'
    };
    
    try {
      // Add to state first (optimistic UI update)
      setShoppingItems(items => [...items, newItem]);
      
      // Add to database if Supabase is available
      if (supabase) {
        const { error } = await supabase
          .from('shopping_list')
          .insert([newItem]);
          
        if (error) throw error;
      }
      
      toast({
        title: "Item added",
        description: "New item has been added to your shopping list",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding item to shopping list:', error);
      toast({
        title: 'Failed to add item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Remove the item if database insert failed
      setShoppingItems(items => items.filter(item => item.id !== newItem.id));
    }
  };
  
  const handleClearChecked = async () => {
    try {
      // Get the checked items before removing them
      const checkedItems = shoppingItems.filter(item => item.isChecked);
      const checkedItemIds = checkedItems.map(item => item.id);
      
      if (checkedItemIds.length === 0) return;
        
      // Optimistic UI update
      setShoppingItems(items => items.filter(item => !item.isChecked));
      
      // Delete from database if Supabase is available
      if (supabase) {
        const { error } = await supabase
          .from('shopping_list')
          .delete()
          .in('id', checkedItemIds);
          
        if (error) throw error;
      }
      
      toast({
        title: "Checked items cleared",
        description: "All checked items have been removed from your list",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error clearing checked items:', error);
      toast({
        title: 'Failed to clear checked items',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // If there's an error, we should reload the list
      if (supabase) {
        const { data } = await supabase.from('shopping_list').select('*');
        if (data) {
          setShoppingItems(data as ShoppingItemData[]);
        }
      }
    }
  };
  
  const handleShare = async () => {
    try {
      toast({
        title: "Sharing shopping list",
        description: "Preparing to share with family members...",
        duration: 3000,
      });
      
      // In a real implementation, we would share the list with family members
      // For now, we'll simulate this with a timeout
      setTimeout(() => {
        toast({
          title: "List shared",
          description: "Shopping list has been shared with family members",
          duration: 3000,
        });
      }, 1000);
    } catch (error) {
      console.error('Error sharing list:', error);
      toast({
        title: 'Failed to share list',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title="Shopping List" 
        showSettings={false} 
        showBack={true} 
        onBack={handleBack} 
      />
      
      <main className="flex-1 px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-kitchen-green">Loading shopping list...</div>
          </div>
        ) : (
          <ShoppingList
            items={shoppingItems}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
            onClearChecked={handleClearChecked}
            onShare={handleShare}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ShoppingListPage;
