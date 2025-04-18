
import React, { useState } from 'react';
import ShoppingItem, { ShoppingItemData } from './ShoppingItem';
import { Button } from '@/components/ui/button';
import { Plus, Share2, CheckSquare, Trash2 } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingItemData[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onClearChecked: () => void;
  onShare: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ 
  items, 
  onToggle, 
  onDelete, 
  onAddNew,
  onClearChecked,
  onShare
}) => {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItemData[]>);
  
  // Sort categories for display
  const sortedCategories = Object.keys(groupedItems).sort();
  
  // Separate checked and unchecked items
  const hasCheckedItems = items.some(item => item.isChecked);
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-white z-10 pb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shopping List</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShare}
              className="border-kitchen-green text-kitchen-green"
            >
              <Share2 size={16} className="mr-1" />
              Share
            </Button>
            
            <Button 
              onClick={onAddNew} 
              className="bg-kitchen-green hover:bg-kitchen-green/90"
            >
              <Plus size={18} className="mr-1" /> Add
            </Button>
          </div>
        </div>
        
        {hasCheckedItems && (
          <div className="flex justify-end mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearChecked}
              className="text-gray-500 hover:text-kitchen-berry hover:bg-kitchen-berry/10"
            >
              <Trash2 size={14} className="mr-1" />
              Clear Checked
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg border border-muted">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">Your shopping list is empty.</p>
            <Button 
              onClick={onAddNew} 
              variant="outline"
              className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            >
              <Plus size={18} className="mr-1" /> Add Your First Item
            </Button>
          </div>
        ) : (
          <>
            {/* Unchecked items first, grouped by category */}
            {sortedCategories.map(category => {
              const categoryItems = groupedItems[category].filter(item => !item.isChecked);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category} className="mb-2">
                  <div className="px-4 py-2 bg-muted/50 font-medium text-sm text-gray-600 uppercase">
                    {category}
                  </div>
                  {categoryItems.map(item => (
                    <ShoppingItem
                      key={item.id}
                      item={item}
                      onToggle={onToggle}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              );
            })}
            
            {/* Checked items at the bottom */}
            {hasCheckedItems && (
              <div className="mt-4">
                <div className="px-4 py-2 bg-muted/50 font-medium text-sm text-gray-600 uppercase flex items-center">
                  <CheckSquare size={14} className="mr-2" />
                  Checked Items
                </div>
                {items
                  .filter(item => item.isChecked)
                  .map(item => (
                    <ShoppingItem
                      key={item.id}
                      item={item}
                      onToggle={onToggle}
                      onDelete={onDelete}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
