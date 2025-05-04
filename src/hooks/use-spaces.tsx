
import { useState, useEffect } from 'react';
import { Space } from '@/types/space';

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>(() => {
    const savedSpaces = localStorage.getItem('pantryChef_spaces');
    return savedSpaces ? JSON.parse(savedSpaces) : [];
  });

  useEffect(() => {
    localStorage.setItem('pantryChef_spaces', JSON.stringify(spaces));
  }, [spaces]);

  const addSpace = (spaceData: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSpace: Space = {
      ...spaceData,
      id: `space-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSpaces(current => [...current, newSpace]);
    return newSpace;
  };

  const updateSpace = (id: string, data: Partial<Space>) => {
    setSpaces(current => 
      current.map(space => 
        space.id === id 
          ? { ...space, ...data, updatedAt: new Date() } 
          : space
      )
    );
  };

  const deleteSpace = (id: string) => {
    setSpaces(current => current.filter(space => space.id !== id));
  };

  const getSpaceById = (id: string) => {
    return spaces.find(space => space.id === id);
  };

  return {
    spaces,
    addSpace,
    updateSpace,
    deleteSpace,
    getSpaceById,
  };
}
