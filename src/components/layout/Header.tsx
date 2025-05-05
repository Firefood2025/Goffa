
import React from 'react';
import { Settings, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title,
  showSettings = true,
  showBack = false,
  onBack
}) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-muted bg-white">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={handleBackClick} 
            className="mr-3 p-1.5 text-kitchen-dark rounded-full hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/39f717d2-59da-48cf-9598-a998871f5d86.png" 
            alt="KOFFA Logo" 
            className="h-10" 
          />
          {title && <span className="ml-3 text-lg font-semibold hidden sm:inline">{title}</span>}
        </Link>
      </div>
      {title && <span className="text-lg font-semibold sm:hidden">{title}</span>}
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
