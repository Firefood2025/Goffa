
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Plus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';

import { mockShoppingItems } from '@/lib/data';

const GrabAndGoPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>(
    mockShoppingItems.filter(item => !item.isChecked)
  );
  
  // Handler functions
  const handleToggle = (id: string) => {
    setShoppingItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  
  const handleQuickAdd = () => {
    toast({
      title: "Quick add",
      description: "This would open a simple item add interface",
      duration: 2000,
    });
  };
  
  const handleExitGrabAndGo = () => {
    navigate('/shopping-list');
  };
  
  // Group items by category
  const groupedItems = shoppingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItemData[]>);
  
  // Sort categories for display
  const sortedCategories = Object.keys(groupedItems).sort();
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Grab & Go mode header */}
      <header className="bg-kitchen-green text-white px-4 py-3 shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag size={24} className="mr-2" />
            <h1 className="text-xl font-bold">Grab & Go Mode</h1>
          </div>
          <button 
            onClick={handleExitGrabAndGo}
            className="p-2 rounded-full hover:bg-white/20"
            aria-label="Exit Grab & Go mode"
          >
            <X size={24} />
          </button>
        </div>
      </header>
      
      <main className="flex-1 px-4 py-6 mb-20">
        {shoppingItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">Your shopping list is empty</p>
            <Button 
              onClick={handleQuickAdd}
              className="bg-kitchen-green hover:bg-kitchen-green/90 text-lg py-6 px-8"
            >
              <Plus size={24} className="mr-2" />
              Add Items
            </Button>
          </div>
        ) : (
          <>
            {sortedCategories.map(category => (
              <div key={category} className="mb-6">
                <h2 className="text-xl font-bold mb-3 px-2">{category}</h2>
                <div className="bg-white rounded-xl shadow-sm">
                  {groupedItems[category].map(item => (
                    <div 
                      key={item.id}
                      className="flex items-center px-4 py-5 border-b border-gray-100 last:border-0"
                    >
                      <button
                        onClick={() => handleToggle(item.id)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${
                          item.isChecked 
                            ? 'bg-kitchen-green border-kitchen-green text-white' 
                            : 'border-gray-300'
                        } flex items-center justify-center mr-4`}
                        aria-label={item.isChecked ? "Uncheck item" : "Check item"}
                      >
                        {item.isChecked && <Check size={18} />}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`text-xl font-medium ${item.isChecked ? 'text-gray-400 line-through' : 'text-kitchen-dark'}`}>
                          {item.name}
                        </h3>
                        
                        {item.note && (
                          <p className="text-base text-gray-500 mt-1">{item.note}</p>
                        )}
                      </div>
                      
                      <span className={`text-lg ${item.isChecked ? 'text-gray-400' : 'text-kitchen-dark'}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
      
      {/* Grab & Go quick add button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleQuickAdd}
          className="bg-kitchen-green text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Quick add item"
        >
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
};

export default GrabAndGoPage;
