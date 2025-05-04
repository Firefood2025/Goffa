
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Space } from '@/types/space';
import { cn } from '@/lib/utils';
import { DynamicIcon } from './DynamicIcon';

interface SpaceListItemProps {
  space: Space;
  onUpdate: (id: string, data: Partial<Space>) => void;
  onDelete: (id: string) => void;
}

const SpaceListItem: React.FC<SpaceListItemProps> = ({ space, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const { id, name, description, icon, color, tasks } = space;
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  const handleClick = () => {
    navigate(`/spaces/${id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };
  
  return (
    <div 
      className="flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors hover:bg-muted/30"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className={cn("p-2 rounded-full", {
          "bg-kitchen-green/10 text-kitchen-green": color === 'green',
          "bg-kitchen-wood/10 text-kitchen-wood": color === 'wood',
          "bg-kitchen-stone/10 text-kitchen-stone": color === 'stone',
          "bg-kitchen-berry/10 text-kitchen-berry": color === 'berry',
          "bg-kitchen-yellow/10 text-kitchen-yellow": color === 'yellow',
        })}>
          <DynamicIcon name={icon} size={20} />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:block text-sm text-muted-foreground">
          {completedTasks}/{totalTasks} tasks
        </div>
        
        <div className="hidden sm:block w-24 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full", {
              "bg-kitchen-green": color === 'green',
              "bg-kitchen-wood": color === 'wood',
              "bg-kitchen-stone": color === 'stone',
              "bg-kitchen-berry": color === 'berry',
              "bg-kitchen-yellow": color === 'yellow',
            })}
            style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted">
              <MoreVertical size={16} />
              <span className="sr-only">Open menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SpaceListItem;
