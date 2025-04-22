
import React from 'react';
import { Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "KOFFA", 
  showSettings = true,
  showBack = false,
  onBack
}) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

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
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/39f717d2-59da-48cf-9598-a998871f5d86.png" 
            alt="KOFFA Logo" 
            className="h-10 mr-2" 
          />
          <h1 className="text-xl font-bold font-heading text-kitchen-dark">{title}</h1>
        </Link>
      </div>
      {showSettings && (
        <div className="flex gap-2">
          <Link to="/profile" className="p-2 rounded-full text-kitchen-dark hover:bg-muted">
            <User size={20} />
          </Link>
          <button 
            onClick={handleSettingsClick}
            className="p-2 rounded-full text-kitchen-dark hover:bg-muted" 
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
