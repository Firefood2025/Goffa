
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Space } from '@/types/space';
import { DynamicIcon } from './DynamicIcon';
import { cn } from '@/lib/utils';

interface SpaceQuickAccessProps {
  spaces: Space[];
}

const SpaceQuickAccess: React.FC<SpaceQuickAccessProps> = ({ spaces }) => {
  const navigate = useNavigate();
  
  if (spaces.length === 0) {
    return null;
  }

  const displayedSpaces = spaces.slice(0, 4);
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 font-heading">Your Spaces</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayedSpaces.map((space) => (
          <div
            key={space.id}
            className="flex flex-col items-center p-3 border rounded-lg bg-white/70 hover:bg-white transition-colors cursor-pointer"
            onClick={() => navigate(`/spaces/${space.id}`)}
          >
            <div className={cn("p-2 rounded-full mb-2", {
              "bg-kitchen-green/10 text-kitchen-green": space.color === 'green',
              "bg-kitchen-wood/10 text-kitchen-wood": space.color === 'wood',
              "bg-kitchen-stone/10 text-kitchen-stone": space.color === 'stone',
              "bg-kitchen-berry/10 text-kitchen-berry": space.color === 'berry',
              "bg-kitchen-yellow/10 text-kitchen-yellow": space.color === 'yellow',
            })}>
              <DynamicIcon name={space.icon} size={24} />
            </div>
            <span className="text-sm font-medium text-center line-clamp-1">{space.name}</span>
          </div>
        ))}
        
        {spaces.length > 4 && (
          <div
            className="flex flex-col items-center justify-center p-3 border rounded-lg bg-white/70 hover:bg-white transition-colors cursor-pointer"
            onClick={() => navigate(`/spaces`)}
          >
            <span className="text-sm font-medium">+{spaces.length - 4} more</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceQuickAccess;
