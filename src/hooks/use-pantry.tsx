
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PantryItemData } from '@/components/pantry/PantryItem';
import { mockPantryItems } from '@/lib/data';
import { supabase, getIdAsString } from '@/integrations/supabase/client';
import { CustomListType } from '@/pages/PantryPage';

export function usePantry() {
  const { toast } = useToast();
  
  const [pantryItems, setPantryItems] = useState<PantryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Default placeholder images for items by category
  const defaultImages = {
    fridge: '/lovable-uploads/fridge-placeholder.jpg',
    freezer: '/lovable-uploads/freezer-placeholder.jpg',
    pantry: '/lovable-uploads/pantry-placeholder.jpg',
    default: '/lovable-uploads/default-placeholder.jpg',
  };
  
  // Fetch pantry items from Supabase
  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        const { data, error } = await supabase
          .from('pantry_items')
          .select('*')
          .order('added_date', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Pantry items from DB:', data);
          
          // Map the data to PantryItemData format
          const mappedData: PantryItemData[] = data.map(item => {
            // Set default image based on category if not provided
            const itemImage = item.image_url || 
              (item.category ? defaultImages[item.category as keyof typeof defaultImages] || defaultImages.default : defaultImages.default);
            
            return {
              id: getIdAsString(item.id),
              name: item.name || '',
              quantity: item.quantity || 1,
              unit: item.unit || 'piece',
              category: item.category || 'pantry',
              addedDate: item.added_date || new Date().toISOString(),
              image: itemImage,
              ...(item.expiry_date && { expiryDate: item.expiry_date }),
            };
          });
          
          setPantryItems(mappedData);
        } else {
          console.log('No pantry items found in DB, using mock data fallback');
          // Add placeholder images to mock items
          const itemsWithImages = mockPantryItems.map(item => ({
            ...item,
            image: item.image || defaultImages[item.category as keyof typeof defaultImages] || defaultImages.default
          }));
          setPantryItems(itemsWithImages);
        }
      } catch (error) {
        console.error('Error fetching pantry items:', error);
        toast({
          title: 'Failed to load pantry items',
          description: 'Using demo data instead',
          variant: 'destructive',
        });
        // Add placeholder images to mock items on error
        const itemsWithImages = mockPantryItems.map(item => ({
          ...item,
          image: item.image || defaultImages[item.category as keyof typeof defaultImages] || defaultImages.default
        }));
        setPantryItems(itemsWithImages);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPantryItems();
  }, [toast]);
  
  // Handler functions
  const handleIncrement = async (id: string) => {
    try {
      // Find the item
      const item = pantryItems.find(item => item.id === id);
      if (!item) return;
      
      const updatedQuantity = item.quantity + 1;
      
      // Optimistic UI update
      setPantryItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: updatedQuantity } : item
        )
      );
      
      // Update in database
      const { error } = await supabase
        .from('pantry_items')
        .update({ quantity: updatedQuantity })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing item quantity:', error);
      toast({
        title: 'Failed to update quantity',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update on error
      setPantryItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };
  
  const handleDecrement = async (id: string) => {
    try {
      // Find the item
      const item = pantryItems.find(item => item.id === id);
      if (!item || item.quantity <= 1) return;
      
      const updatedQuantity = item.quantity - 1;
      
      // Optimistic UI update
      setPantryItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: updatedQuantity } : item
        )
      );
      
      // Update in database
      const { error } = await supabase
        .from('pantry_items')
        .update({ quantity: updatedQuantity })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error decrementing item quantity:', error);
      toast({
        title: 'Failed to update quantity',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update on error
      setPantryItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }
  };
  
  const handleDelete = async (id: string) => {
    // Store deleted item for potential restoration
    let deletedItem: PantryItemData | undefined;
    
    try {
      // Find the item to delete
      deletedItem = pantryItems.find(item => item.id === id);
      if (!deletedItem) return;
      
      // Optimistic UI update
      setPantryItems(items => items.filter(item => item.id !== id));
      
      // Remove from selected items if it was selected
      setSelectedItems(selected => selected.filter(itemId => itemId !== id));
      
      // Delete from database
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your pantry",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting pantry item:', error);
      toast({
        title: 'Failed to delete item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update on error if we have the deletedItem
      if (deletedItem) {
        setPantryItems(prev => [...prev, deletedItem as PantryItemData]);
      }
    }
  };
  
  const handleAddNew = async (newItem: Partial<PantryItemData>) => {
    try {
      if (!newItem.name) {
        toast({
          title: "Error",
          description: "Please enter a name for the item",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      // Set default image based on category if not provided
      const itemImage = newItem.image || 
        (newItem.category ? defaultImages[newItem.category as keyof typeof defaultImages] : defaultImages.default);
      
      // Temporary ID for optimistic UI update
      const tempId = `temp-${Date.now()}`;
      
      const fullNewItem: PantryItemData = {
        id: tempId,
        name: newItem.name as string,
        quantity: newItem.quantity || 1,
        unit: newItem.unit || 'piece',
        category: newItem.category || 'pantry',
        addedDate: new Date().toISOString(),
        image: itemImage,
        ...(newItem.expiryDate && { expiryDate: newItem.expiryDate }),
      };
      
      // Optimistic UI update - add to the list immediately
      setPantryItems(prev => [fullNewItem, ...prev]);
      
      // Save to database
      const { data, error } = await supabase
        .from('pantry_items')
        .insert({
          name: fullNewItem.name,
          quantity: fullNewItem.quantity,
          unit: fullNewItem.unit,
          category: fullNewItem.category,
          expiry_date: fullNewItem.expiryDate,
          image_url: fullNewItem.image !== defaultImages[fullNewItem.category as keyof typeof defaultImages] ? fullNewItem.image : null
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Update item with database ID
      if (data) {
        const dbItem: PantryItemData = {
          id: getIdAsString(data.id),
          name: data.name || '',
          quantity: data.quantity || 1,
          unit: data.unit || 'piece',
          category: data.category || 'pantry',
          addedDate: data.added_date || new Date().toISOString(),
          image: data.image_url || itemImage,
          ...(data.expiry_date && { expiryDate: data.expiry_date }),
        };
        
        // Replace temp item with DB item
        setPantryItems(items => 
          items.map(item => 
            item.id === tempId ? dbItem : item
          )
        );
      }
      
      toast({
        title: "Item added",
        description: `${fullNewItem.name} has been added to your pantry`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding item to pantry:", error);
      toast({
        title: 'Failed to add item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Remove the temporary item if saving fails
      setPantryItems(items => items.filter(item => item.id !== `temp-${Date.now()}`));
    }
  };
  
  const handleSendToShopping = async (selectedItemIds: string[]) => {
    if (selectedItemIds.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to add to your shopping list",
        duration: 3000,
      });
      return;
    }
    
    try {
      // Get the selected items
      const selectedItemsList = pantryItems.filter(item => selectedItemIds.includes(item.id));
      
      // Add each item to the shopping list
      for (const item of selectedItemsList) {
        await supabase.from('shopping_list').insert({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          ischecked: false
        });
      }
      
      toast({
        title: "Items added to shopping list",
        description: `Added ${selectedItemIds.length} item(s) to your shopping list`,
        duration: 3000,
      });
      
      // Clear the selection after adding to shopping list
      setSelectedItems([]);
    } catch (error) {
      console.error("Error adding items to shopping list:", error);
      toast({
        title: 'Failed to add items to shopping list',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };
  
  const handleToggleSelectItem = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };
  
  return {
    pantryItems,
    isLoading,
    selectedItems,
    handleIncrement,
    handleDecrement,
    handleDelete,
    handleAddNew,
    handleSendToShopping,
    handleToggleSelectItem
  };
}
