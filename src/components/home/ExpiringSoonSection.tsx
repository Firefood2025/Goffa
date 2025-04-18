
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExpiringSoonItem {
  id: string;
  name: string;
  daysLeft: number;
  image?: string;
}

interface ExpiringSoonSectionProps {
  items: ExpiringSoonItem[];
}

const ExpiringSoonSection: React.FC<ExpiringSoonSectionProps> = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-kitchen-dark flex items-center">
          <Clock size={20} className="mr-2 text-kitchen-berry" />
          Use Soon!
        </h2>
        <Link to="/pantry?filter=expiring" className="text-sm text-kitchen-green flex items-center">
          See All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-none">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 w-32 rounded-lg overflow-hidden shadow-sm bg-white border border-muted"
          >
            <div className="h-20 bg-gray-200 flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              ) : (
                <span className="text-3xl">🍽️</span>
              )}
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm truncate">{item.name}</h3>
              <p className={`text-xs ${item.daysLeft <= 1 ? 'text-kitchen-berry' : 'text-amber-600'}`}>
                {item.daysLeft === 0 
                  ? 'Expires today!' 
                  : item.daysLeft === 1 
                    ? '1 day left' 
                    : `${item.daysLeft} days left`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiringSoonSection;
