
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, FolderPlus, ListFilter } from 'lucide-react';

interface PantryActionsProps {
  onAddNew: () => void;
  onSendToShopping: () => void;
}

const PantryActions: React.FC<PantryActionsProps> = ({
  onAddNew,
  onSendToShopping,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      <Button 
        onClick={onAddNew} 
        className="bg-kitchen-green hover:bg-kitchen-green/90"
      >
        <Plus size={18} className="mr-1" /> Add Item
      </Button>
      <Button 
        variant="outline" 
        className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10"
        onClick={onSendToShopping}
      >
        <ShoppingCart size={18} className="mr-1" /> Send to Shopping List
      </Button>
      <Button
        variant="outline"
        className="ml-auto sm:ml-0"
      >
        <ListFilter size={18} className="mr-1" /> Advanced Filters
      </Button>
    </div>
  );
};

export default PantryActions;
