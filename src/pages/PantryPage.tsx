
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
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your pantry",
      duration: 3000,
    });
  };
  
  const handleAddNew = () => {
    toast({
      title: "Add item feature",
      description: "This would open a form to add a new pantry item",
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

  const handleSendToShopping = () => {
    toast({
      title: "Shopping List Updated",
      description: "Selected items have been added to your shopping list",
      duration: 3000,
    });
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
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PantryList
                items={filteredItems}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
                customLists={customLists}
                onAddToList={handleAddToList}
              />
            </div>
            
            <div className="lg:col-span-1">
              <CustomLists
                lists={customLists}
                pantryItems={pantryItems}
                onCreateList={handleCreateList}
                onDeleteList={handleDeleteList}
                onRenameList={handleRenameList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PantryPage;
