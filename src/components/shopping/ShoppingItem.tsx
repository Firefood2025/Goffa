
import React from 'react';
import { Check, Trash2 } from 'lucide-react';

export interface ShoppingItemData {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
  note?: string;
}

interface ShoppingItemProps {
  item: ShoppingItemData;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ 
  item, 
  onToggle, 
  onDelete 
}) => {
  return (
    <div className={`flex items-center p-4 border-b border-muted ${item.isChecked ? 'bg-muted/50' : ''}`}>
      <button
        onClick={() => onToggle(item.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border ${
          item.isChecked 
            ? 'bg-kitchen-green border-kitchen-green text-white' 
            : 'border-gray-300'
        } flex items-center justify-center mr-3`}
        aria-label={item.isChecked ? "Uncheck item" : "Check item"}
      >
        {item.isChecked && <Check size={14} />}
      </button>
      
      <div className="flex-1">
        <h3 className={`font-medium ${item.isChecked ? 'text-gray-500 line-through' : 'text-kitchen-dark'}`}>
          {item.name}
        </h3>
        
        {item.note && (
          <p className="text-sm text-gray-500 mt-1">{item.note}</p>
        )}
      </div>
      
      <div className="flex items-center">
        <span className={`mr-4 ${item.isChecked ? 'text-gray-500' : 'text-kitchen-dark'}`}>
          {item.quantity} {item.unit}
        </span>
        
        <button
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-muted"
          aria-label="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ShoppingItem;
