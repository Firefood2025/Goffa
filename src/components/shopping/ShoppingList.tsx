
import React, { useState } from 'react';
import ShoppingItem, { ShoppingItemData } from './ShoppingItem';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Trash2 } from 'lucide-react';
import { ListLayout, ViewMode } from '@/components/ui/list-layout';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
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
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button 
              onClick={onAddNew} 
              className="bg-kitchen-green hover:bg-kitchen-green/90"
            >
              <Plus size={18} className="mr-1" /> Add Item
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onShare}
              className="border-kitchen-green text-kitchen-green"
            >
              <Share2 size={16} />
            </Button>
          </div>
          
          {hasCheckedItems && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearChecked}
              className="text-gray-500 hover:text-kitchen-berry hover:bg-kitchen-berry/10"
            >
              <Trash2 size={14} className="mr-1" />
              Clear Checked
            </Button>
          )}
        </div>
      </div>
      
      <ListLayout
        title="Shopping List"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        className="bg-gradient-to-br from-kitchen-cream to-white"
      >
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
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : ''}>
            {sortedCategories.map(category => {
              const categoryItems = groupedItems[category].filter(item => !item.isChecked);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category} className="mb-2">
                  <div className="px-4 py-2 bg-muted/50 font-medium text-sm text-gray-600 uppercase">
                    {category}
                  </div>
                  <div className={viewMode === 'grid' ? 'grid gap-2' : ''}>
                    {categoryItems.map(item => (
                      <ShoppingItem
                        key={item.id}
                        item={item}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Checked items section */}
            {hasCheckedItems && (
              <div className="mt-4 col-span-full">
                <div className="px-4 py-2 bg-muted/50 font-medium text-sm text-gray-600 uppercase flex items-center">
                  <Trash2 size={14} className="mr-2" />
                  Checked Items
                </div>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : ''}>
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
              </div>
            )}
          </div>
        )}
      </ListLayout>
    </div>
  );
};

export default ShoppingList;
