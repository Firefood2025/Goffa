
import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "PantryChef AI", 
  showSettings = true,
  showBack = false,
  onBack
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-muted">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={onBack} 
            className="mr-3 text-kitchen-dark"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold font-heading text-kitchen-dark">{title}</h1>
      </div>
      {showSettings && (
        <button 
          className="p-2 rounded-full text-kitchen-dark hover:bg-muted" 
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      )}
    </header>
  );
};

export default Header;
