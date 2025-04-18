
import React, { useState } from 'react';
import PantryItem, { PantryItemData } from './PantryItem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PantryListProps {
  items: PantryItemData[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const PantryList: React.FC<PantryListProps> = ({ 
  items, 
  onIncrement, 
  onDecrement, 
  onDelete,
  onAddNew
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Filter items based on active tab
  const getFilteredItems = () => {
    switch (activeTab) {
      case "fridge":
        return items.filter(item => item.category === "fridge");
      case "freezer":
        return items.filter(item => item.category === "freezer");
      case "pantry":
        return items.filter(item => item.category === "pantry");
      case "expiring":
        return items.filter(item => {
          if (!item.expiryDate) return false;
          const today = new Date();
          const expiry = new Date(item.expiryDate);
          const diffTime = expiry.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        }).sort((a, b) => {
          const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
          const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
          return dateA - dateB;
        });
      default:
        return items;
    }
  };
  
  const filteredItems = getFilteredItems();
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-white z-10 pb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Pantry</h2>
          <Button 
            onClick={onAddNew} 
            className="bg-kitchen-green hover:bg-kitchen-green/90"
          >
            <Plus size={18} className="mr-1" /> Add Item
          </Button>
        </div>
      
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="fridge">Fridge</TabsTrigger>
            <TabsTrigger value="freezer">Freezer</TabsTrigger>
            <TabsTrigger value="pantry">Pantry</TabsTrigger>
            <TabsTrigger value="expiring" className="text-kitchen-berry">Use Soon</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="bg-white rounded-lg border border-muted">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">No items found in this category.</p>
            <Button 
              onClick={onAddNew} 
              variant="outline"
              className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            >
              <Plus size={18} className="mr-1" /> Add Your First Item
            </Button>
          </div>
        ) : (
          filteredItems.map(item => (
            <PantryItem
              key={item.id}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PantryList;
