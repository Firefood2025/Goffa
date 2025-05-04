import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ListFilter, ShoppingCart } from 'lucide-react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PantryList from '@/components/pantry/PantryList';
import { PantryItemData } from '@/components/pantry/PantryItem';
import { useToast } from '@/hooks/use-toast';
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
import PantryActions from '@/components/pantry/PantryActions';
import CustomLists from '@/components/pantry/CustomLists';

export type CustomListType = {
  id: string;
  name: string;
  items: string[]; // Array of pantry item IDs
};

const PantryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pantryItems, setPantryItems] = useState<PantryItemData[]>(mockPantryItems);
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
  const [customLists, setCustomLists] = useState<CustomListType[]>([
    { id: '1', name: 'Weekly Recipes', items: ['1', '3', '5'] },
    { id: '2', name: 'Smoothie Ingredients', items: ['3'] },
    { id: '3', name: 'Kids\' Lunches', items: ['6', '7'] }
  ]);
  
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
    const fullNewItem: PantryItemData = {
      id: newId,
      name: newItem.name as string,
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'piece',
      category: newItem.category || 'pantry',
      addedDate: new Date().toISOString(),
      ...(newItem.expiryDate && { expiryDate: newItem.expiryDate }),
      ...(newItem.image && { image: newItem.image }),
    };
    
    setPantryItems([...pantryItems, fullNewItem]);
    setAddItemDialogOpen(false);
    
    // Reset new item form
    setNewItem({
      name: '',
      quantity: 1,
      unit: 'piece',
      category: 'pantry',
      addedDate: new Date().toISOString(),
    });
    
    toast({
      title: "Item added",
      description: `${fullNewItem.name} has been added to your pantry`,
      duration: 3000,
    });
  };
  
  const handleBack = () => {
    navigate('/');
  };

  const handleCreateList = (name: string) => {
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

  const handleSendToShopping = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to add to your shopping list",
        duration: 3000,
      });
      return;
    }
    
    // In a real app, this would add the items to the shopping list
    // For now, we'll just simulate it
    
    // Get the names of the selected items for the toast message
    const selectedItemNames = pantryItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.name)
      .join(", ");
    
    toast({
      title: "Shopping List Updated",
      description: `Added ${selectedItems.length} item(s) to your shopping list: ${selectedItemNames}`,
      duration: 3000,
    });
    
    // Clear the selection after adding to shopping list
    setSelectedItems([]);
    
    // Simulate navigation to shopping list page after a short delay
    setTimeout(() => {
      navigate('/shopping-list');
    }, 2000);
  };
  
  const filteredItems = searchQuery ? 
    pantryItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : pantryItems;
  
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title="My Pantry" 
        showSettings={false} 
        showBack={true} 
        onBack={handleBack} 
      />
      
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-medium text-kitchen-dark">
              Track your ingredients, organize your kitchen, and make meal planning effortless.
            </h2>
          </div>
          
          <div className="mb-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
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
          </div>
          
          {/* Moved CustomLists to the top */}
          <div className="mb-6">
            <CustomLists
              lists={customLists}
              pantryItems={pantryItems}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onRenameList={handleRenameList}
              onRemoveFromList={handleRemoveFromList}
            />
          </div>

          {/* Pantry List now takes full width */}
          <div>
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
          </div>
        </div>
      </main>
      
      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Pantry Item</DialogTitle>
            <DialogDescription>
              Enter the details of the item you want to add to your pantry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry" className="text-right">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={newItem.image || ''}
                onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                placeholder="https://example.com/image.jpg (optional)"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewItem} className="bg-kitchen-green hover:bg-kitchen-green/90">
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
