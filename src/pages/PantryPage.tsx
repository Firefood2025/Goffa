import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, ListFilter, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PantryList from '@/components/pantry/PantryList';
import PantryActions from '@/components/pantry/PantryActions';
import { PantryItemData } from '@/components/pantry/PantryItem';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { mockPantryItems } from '@/lib/data';
import CustomLists from '@/components/pantry/CustomLists';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageUploader from '@/components/pantry/ImageUploader';

export type CustomListType = {
  id: string;
  name: string;
  items: string[]; // Array of pantry item IDs
};

// Default placeholder images for items by category
const defaultImages = {
  fridge: '/lovable-uploads/fridge-placeholder.jpg',
  freezer: '/lovable-uploads/freezer-placeholder.jpg',
  pantry: '/lovable-uploads/pantry-placeholder.jpg',
  default: '/lovable-uploads/default-placeholder.jpg',
};

// Add placeholder images to items that don't have one
const itemsWithImages = mockPantryItems.map(item => ({
  ...item,
  image: item.image || defaultImages[item.category as keyof typeof defaultImages] || defaultImages.default
}));

const PantryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [pantryItems, setPantryItems] = useState<PantryItemData[]>(itemsWithImages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PantryItemData>>({
    name: '',
    quantity: 1,
    unit: 'piece',
    category: 'pantry',
    addedDate: new Date().toISOString(),
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [customLists, setCustomLists] = useState<CustomListType[]>([
    { id: '1', name: 'Weekly Recipes', items: ['1', '3', '5'] },
    { id: '2', name: 'Smoothie Ingredients', items: ['3'] },
    { id: '3', name: 'Kids\' Lunches', items: ['6', '7'] }
  ]);

  // Check if we should open the add item dialog from URL params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setAddItemDialogOpen(true);
      // Clean up the URL
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams]);

  // Notification counter for demo purposes
  const [notificationCount] = useState(3);
  
  // Handler functions
  const handleIncrement = (id: string) => {
    setPantryItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  const handleDecrement = (id: string) => {
    setPantryItems(items => 
      items.map(item => 
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };
  
  const handleDelete = (id: string) => {
    setPantryItems(items => items.filter(item => item.id !== id));
    
    // Also remove from any custom lists
    setCustomLists(lists => 
      lists.map(list => ({
        ...list,
        items: list.items.filter(itemId => itemId !== id)
      }))
    );
    
    // Remove from selected items if it was selected
    setSelectedItems(selected => selected.filter(itemId => itemId !== id));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your pantry",
      duration: 3000,
    });
  };
  
  const handleAddNew = () => {
    setAddItemDialogOpen(true);
    setNewItem({
      name: '',
      quantity: 1,
      unit: 'piece',
      category: 'pantry',
      addedDate: new Date().toISOString(),
    });
  };
  
  const handleSendToShopping = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to add to your shopping list",
        duration: 3000,
      });
      return;
    }
    
    // Get the selected items
    const selectedItemsList = pantryItems.filter(item => selectedItems.includes(item.id));
    
    // Create a new shopping list with the current date
    const newShoppingList = {
      id: Date.now().toString(),
      name: `Shopping List - ${new Date().toLocaleDateString()}`,
      creator: "Current User", // In a real app, this would be the current user
      items: selectedItemsList.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        isChecked: false,
        image: item.image
      }))
    };
    
    // In a real app, we would save this to the database
    console.log("Created new shopping list:", newShoppingList);
    
    // Show success message
    toast({
      title: "Shopping List Created",
      description: `Added ${selectedItems.length} item(s) to a new shopping list`,
      duration: 3000,
    });
    
    // Clear the selection after adding to shopping list
    setSelectedItems([]);
    
    // Navigate to shopping list page after a short delay
    setTimeout(() => {
      navigate('/shopping-list');
    }, 1500);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setNewItem({...newItem, image: result});
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemoveUploadedImage = () => {
    setUploadedImage(null);
    setNewItem({...newItem, image: undefined});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSaveNewItem = () => {
    if (!newItem.name) {
      toast({
        title: "Error",
        description: "Please enter a name for the item",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const newId = (pantryItems.length + 1).toString();
    
    // Set default image based on category if not provided
    const itemImage = newItem.image || 
      (newItem.category ? defaultImages[newItem.category as keyof typeof defaultImages] : defaultImages.default);
    
    const fullNewItem: PantryItemData = {
      id: newId,
      name: newItem.name as string,
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'piece',
      category: newItem.category || 'pantry',
      addedDate: new Date().toISOString(),
      image: itemImage,
      ...(newItem.expiryDate && { expiryDate: newItem.expiryDate }),
    };
    
    setPantryItems(prev => [fullNewItem, ...prev]);
    setAddItemDialogOpen(false);
    
    // Reset new item form and uploaded image
    setNewItem({
      name: '',
      quantity: 1,
      unit: 'piece',
      category: 'pantry',
      addedDate: new Date().toISOString(),
    });
    setUploadedImage(null);
    
    toast({
      title: "Item added",
      description: `${fullNewItem.name} has been added to your pantry`,
      duration: 3000,
    });

    // In a real app, we would save to database here
    console.log("Added item to database:", fullNewItem);
  };
  
  const handleBack = () => {
    navigate('/');
  };

  const handleCreateList = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "List name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const newList: CustomListType = {
      id: Date.now().toString(),
      name,
      items: []
    };
    setCustomLists([...customLists, newList]);
    
    toast({
      title: "New list created",
      description: `"${name}" list has been created`,
      duration: 3000,
    });
  };

  const handleAddToList = (itemId: string, listId: string) => {
    setCustomLists(lists => 
      lists.map(list => 
        list.id === listId && !list.items.includes(itemId)
          ? { ...list, items: [...list.items, itemId] }
          : list
      )
    );
    
    const listName = customLists.find(list => list.id === listId)?.name;
    toast({
      title: "Item added to list",
      description: `Item added to "${listName}"`,
      duration: 3000,
    });
  };

  const handleRemoveFromList = (itemId: string, listId: string) => {
    setCustomLists(lists => 
      lists.map(list => 
        list.id === listId
          ? { ...list, items: list.items.filter(id => id !== itemId) }
          : list
      )
    );
  };

  const handleDeleteList = (listId: string) => {
    setCustomLists(lists => lists.filter(list => list.id !== listId));
    
    toast({
      title: "List removed",
      description: "The list has been deleted",
      duration: 3000,
    });
  };

  const handleRenameList = (listId: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "List name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setCustomLists(lists => 
      lists.map(list => 
        list.id === listId ? { ...list, name: newName } : list
      )
    );
  };

  const handleToggleSelectItem = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const filteredItems = searchQuery ? 
    pantryItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : pantryItems;
  
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title="My Pantry" 
        showSettings={true} 
        showBack={true} 
        onBack={handleBack}
        notificationCount={notificationCount}
      />
      
      <main className="flex-1 px-0 sm:px-4 py-4 sm:py-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-3 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 sm:mb-6 text-center"
          >
            <h2 className="text-lg sm:text-xl font-medium text-kitchen-dark">
              Track your ingredients, organize your kitchen
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-4 sm:mb-6"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={isMobile ? 16 : 18} />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <PantryActions 
                  onAddNew={handleAddNew} 
                  onSendToShopping={handleSendToShopping}
                  selectedItems={selectedItems}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* CustomLists */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-4 sm:mb-6"
          >
            <ScrollArea className="w-full overflow-x-auto hide-scrollbar">
              <div className="pb-2">
                <CustomLists
                  lists={customLists}
                  pantryItems={pantryItems}
                  onCreateList={handleCreateList}
                  onDeleteList={handleDeleteList}
                  onRenameList={handleRenameList}
                  onRemoveFromList={handleRemoveFromList}
                />
              </div>
            </ScrollArea>
          </motion.div>

          {/* Pantry List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <PantryList
              items={filteredItems}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
              customLists={customLists}
              onAddToList={handleAddToList}
              selectedItems={selectedItems}
              onToggleSelectItem={handleToggleSelectItem}
            />
          </motion.div>
        </div>
      </main>
      
      {/* Add Item Dialog */}
      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogContent className={`sm:max-w-[425px] ${isMobile ? 'p-4 max-h-[90vh]' : ''}`}>
          <DialogHeader>
            <DialogTitle>Add New Pantry Item</DialogTitle>
            <DialogDescription>
              Enter the details of the item you want to add to your pantry.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4 pr-4">
              {/* Image Upload Section using the ImageUploader component */}
              <ImageUploader
                initialImage={newItem.image}
                onImageChange={(imageData) => setNewItem({...newItem, image: imageData || undefined})}
              />
              
              <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="name" className="text-right col-span-1">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="col-span-3"
                  placeholder="e.g. Rice, Milk, Eggs"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="quantity" className="text-right col-span-1">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newItem.quantity || 1}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="unit" className="text-right col-span-1">
                  Unit
                </Label>
                <Select 
                  value={newItem.unit || 'piece'} 
                  onValueChange={(value) => setNewItem({...newItem, unit: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="kg">Kilogram</SelectItem>
                    <SelectItem value="g">Gram</SelectItem>
                    <SelectItem value="l">Liter</SelectItem>
                    <SelectItem value="ml">Milliliter</SelectItem>
                    <SelectItem value="cup">Cup</SelectItem>
                    <SelectItem value="tbsp">Tablespoon</SelectItem>
                    <SelectItem value="tsp">Teaspoon</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="can">Can</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="category" className="text-right col-span-1">
                  Category
                </Label>
                <Select 
                  value={newItem.category || 'pantry'} 
                  onValueChange={(value) => setNewItem({...newItem, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fridge">Fridge</SelectItem>
                    <SelectItem value="freezer">Freezer</SelectItem>
                    <SelectItem value="pantry">Pantry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="expiry" className="text-right col-span-1">
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  type="date"
                  value={newItem.expiryDate || ''}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddItemDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNewItem} 
              className="bg-kitchen-green hover:bg-kitchen-green/90 w-full sm:w-auto"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default PantryPage;
