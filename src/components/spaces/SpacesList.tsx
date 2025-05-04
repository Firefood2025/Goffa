
import React from 'react';
import { ViewMode } from '@/components/ui/list-layout';
import { Space } from '@/types/space';
import SpaceCard from './SpaceCard';
import SpaceListItem from './SpaceListItem';

interface SpacesListProps {
  spaces: Space[];
  viewMode: ViewMode;
  onUpdate: (id: string, data: Partial<Space>) => void;
  onDelete: (id: string) => void;
}

const SpacesList: React.FC<SpacesListProps> = ({ 
  spaces, 
  viewMode,
  onUpdate,
  onDelete
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {spaces.map(space => (
          <SpaceCard 
            key={space.id} 
            space={space} 
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {spaces.map(space => (
        <SpaceListItem 
          key={space.id} 
          space={space}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SpacesList;
