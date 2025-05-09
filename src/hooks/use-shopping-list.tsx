
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { mockShoppingItems } from '@/lib/data';
import { supabase, getIdAsString } from '@/integrations/supabase/client';

export function useShoppingList() {
  const { toast } = useToast();
  const location = useLocation();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>(mockShoppingItems);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle items passed from Grab & Go mode or other routes
  useEffect(() => {
    if (location.state) {
      if (location.state.newList) {
        const { newList } = location.state;
        
        if (newList.items && newList.items.length > 0) {
          // Set the new shopping list items from the passed state
          setShoppingItems(prev => {
            // Merge with existing items, avoid duplicates by name
            const existingNames = new Set(prev.map(item => item.name));
            const newItems = newList.items.filter(item => !existingNames.has(item.name));
            return [...prev, ...newItems];
          });
          
          toast({
            title: `List "${newList.name}" loaded`,
            description: `Added ${newList.items.length} items from Grab & Go mode`,
            duration: 3000,
          });
        }
      }
    }
  }, [location.state, toast]);
  
  // Fetch items from Supabase if available
  useEffect(() => {
    const fetchShoppingItems = async () => {
      try {
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map the data to ShoppingItemData format
          const mappedData: ShoppingItemData[] = data.map(item => ({
            id: getIdAsString(item.id),
            name: item.name,
            quantity: item.quantity || 1,
            unit: item.unit || 'pc',
            category: item.category || 'General',
            isChecked: item.ischecked || false, // Map from ischecked (DB) to isChecked (code)
            note: item.note
          }));
          
          setShoppingItems(mappedData);
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
        .update({ ischecked: updatedItem.isChecked }) // Use ischecked for DB, isChecked for UI
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
    try {
      // Create a new item with the provided data
      const newItem: ShoppingItemData = {
        id: `new-${Date.now()}`, // Temporary ID
        name: newItemData.name || 'New Item',
        quantity: newItemData.quantity || 1,
        unit: newItemData.unit || 'pc',
        category: newItemData.category || 'General',
        isChecked: newItemData.isChecked || false,
        note: newItemData.note
      };
      
      // Add to database if Supabase is available
      const { data, error } = await supabase
        .from('shopping_list')
        .insert({
          name: newItem.name,
          quantity: newItem.quantity,
          unit: newItem.unit,
          category: newItem.category,
          ischecked: newItem.isChecked, // Use ischecked for DB, isChecked for UI
          note: newItem.note
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Use the returned item with the proper database ID
      if (data) {
        const dbItem: ShoppingItemData = {
          id: getIdAsString(data.id),
          name: data.name,
          quantity: data.quantity || 1,
          unit: data.unit || 'pc',
          category: data.category || 'General',
          isChecked: data.ischecked || false, // Map from ischecked (DB) to isChecked (UI)
          note: data.note
        };
        
        setShoppingItems(items => [...items, dbItem]);
      } else {
        // Fallback to using the item with temporary ID
        setShoppingItems(items => [...items, newItem]);
      }
      
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
        const mappedData: ShoppingItemData[] = data.map(item => ({
          id: getIdAsString(item.id),
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'pc',
          category: item.category || 'General',
          isChecked: item.ischecked || false, // Map from ischecked (DB) to isChecked (UI)
          note: item.note
        }));
        setShoppingItems(mappedData);
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
