
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
    primary: 'bg-kitchen-green text-white hover:bg-kitchen-green/90',
    secondary: 'bg-gradient-to-br from-kitchen-wood to-kitchen-stone text-white hover:opacity-90',
    accent: 'bg-kitchen-berry text-white hover:bg-kitchen-berry/90',
    alert: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  return (
    <Link 
      to={to} 
      className={`block rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${variantClasses[variant]} ${className}`}
    >
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Icon size={40} className="mb-3" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </Link>
  );
};

export default ActionTile;
