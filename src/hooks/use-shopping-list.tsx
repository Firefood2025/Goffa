
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { mockShoppingItems } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';

export function useShoppingList() {
  const { toast } = useToast();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>(mockShoppingItems);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch items from Supabase if available
  useEffect(() => {
    const fetchShoppingItems = async () => {
      try {
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setShoppingItems(data as ShoppingItemData[]);
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
      const { error } = await supabase
        .from('shopping_list')
        .update({ isChecked: updatedItem.isChecked })
        .eq('id', id);
        
      if (error) throw error;
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
      if (!deletedItem) return;
      
      // Optimistic UI update
      setShoppingItems(items => items.filter(item => item.id !== id));
      
      // Delete from database if Supabase is available
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
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
  
  const handleAddNew = async (newItemData: Partial<ShoppingItemData>) => {
    // Create a new item with the provided data
    const newItem: ShoppingItemData = {
      id: `new-${Date.now()}`,
      name: newItemData.name || 'New Item',
      quantity: newItemData.quantity || 1,
      unit: newItemData.unit || 'pc',
      category: newItemData.category || 'General',
      isChecked: newItemData.isChecked || false,
      note: newItemData.note
    };
    
    try {
      // Add to state first (optimistic UI update)
      setShoppingItems(items => [...items, newItem]);
      
      // Add to database if Supabase is available
      const { error } = await supabase
        .from('shopping_list')
        .insert([newItem]);
        
      if (error) throw error;
      
      toast({
        title: "Item added",
        description: `${newItem.name} has been added to your shopping list`,
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
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .in('id', checkedItemIds);
        
      if (error) throw error;
      
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
      const { data } = await supabase.from('shopping_list').select('*');
      if (data) {
        setShoppingItems(data as ShoppingItemData[]);
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

  return {
    shoppingItems,
    isLoading,
    handleToggle,
    handleDelete,
    handleAddNew,
    handleClearChecked,
    handleShare
  };
}
