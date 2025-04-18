
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
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      produce: 'from-green-50 to-green-100',
      dairy: 'from-blue-50 to-blue-100',
      meat: 'from-red-50 to-red-100',
      bakery: 'from-yellow-50 to-yellow-100',
      pantry: 'from-orange-50 to-orange-100',
      default: 'from-gray-50 to-gray-100'
    };
    return gradients[category.toLowerCase()] || gradients.default;
  };

  return (
    <div 
      className={`
        flex items-center p-4 border border-muted rounded-lg
        transition-all duration-200 hover:shadow-md
        ${item.isChecked ? 'bg-muted/50' : `bg-gradient-to-r ${getCategoryGradient(item.category)}`}
      `}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-full border 
          transition-colors duration-200
          ${item.isChecked 
            ? 'bg-kitchen-green border-kitchen-green text-white' 
            : 'border-gray-300 hover:border-kitchen-green'}
          flex items-center justify-center mr-3
        `}
        aria-label={item.isChecked ? "Uncheck item" : "Check item"}
      >
        {item.isChecked && <Check size={14} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${item.isChecked ? 'text-gray-500 line-through' : 'text-kitchen-dark'}`}>
          {item.name}
        </h3>
        
        {item.note && (
          <p className="text-sm text-gray-500 mt-1 truncate">{item.note}</p>
        )}
      </div>
      
      <div className="flex items-center ml-3">
        <span className={`mr-4 ${item.isChecked ? 'text-gray-500' : 'text-kitchen-dark'}`}>
          {item.quantity} {item.unit}
        </span>
        
        <button
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-muted transition-colors duration-200"
          aria-label="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ShoppingItem;
