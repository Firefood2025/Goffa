
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionTileProps {
  title: string;
  icon: LucideIcon;
  to: string;
  variant: 'primary' | 'secondary' | 'accent' | 'alert';
  className?: string;
}

const ActionTile: React.FC<ActionTileProps> = ({ 
  title, 
  icon: Icon, 
  to,
  variant,
  className = ''
}) => {
  const variantClasses = {
    primary: 'action-tile-primary',
    secondary: 'action-tile-secondary',
    accent: 'action-tile-accent',
    alert: 'action-tile-alert'
  };
  
  return (
    <Link 
      to={to} 
      className={`action-tile ${variantClasses[variant]} ${className}`}
    >
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Icon size={40} className="mb-3" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </Link>
  );
};

export default ActionTile;
