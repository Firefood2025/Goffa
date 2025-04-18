
import React from 'react';
import { Calendar, Minus, Plus, Trash2 } from 'lucide-react';

export interface PantryItemData {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
  addedDate: string;
}

interface PantryItemProps {
  item: PantryItemData;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
}

const PantryItem: React.FC<PantryItemProps> = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onDelete 
}) => {
  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    if (!item.expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilExpiry = getDaysUntilExpiry();
  
  // Determine expiry status styling
  const getExpiryStatus = () => {
    if (daysUntilExpiry === null) return null;
    
    if (daysUntilExpiry <= 0) {
      return { color: 'text-kitchen-berry', text: 'Expired' };
    } else if (daysUntilExpiry <= 3) {
      return { color: 'text-kitchen-berry', text: `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} left` };
    } else if (daysUntilExpiry <= 7) {
      return { color: 'text-kitchen-yellow', text: `${daysUntilExpiry} days left` };
    }
    
    return { color: 'text-gray-500', text: `Expires: ${new Date(item.expiryDate).toLocaleDateString()}` };
  };
  
  const expiryStatus = getExpiryStatus();
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-muted">
      <div className="flex-1">
        <h3 className="font-medium text-kitchen-dark">{item.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          {expiryStatus && (
            <span className={`flex items-center mr-3 ${expiryStatus.color}`}>
              <Calendar size={14} className="mr-1" />
              {expiryStatus.text}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onDecrement(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-kitchen-dark"
          aria-label="Decrease quantity"
          disabled={item.quantity <= 1}
        >
          <Minus size={16} />
        </button>
        
        <span className="w-10 text-center font-medium">
          {item.quantity} {item.unit}
        </span>
        
        <button
          onClick={() => onIncrement(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-kitchen-dark"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
        
        <button
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-kitchen-berry text-white ml-2"
          aria-label="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PantryItem;
