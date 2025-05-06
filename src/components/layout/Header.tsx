
import React from 'react';
import { Settings, User, ArrowLeft, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  title,
  showSettings = true,
  showBack = false,
  onBack,
  notificationCount = 0
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    <header className="sticky top-0 z-40 flex items-center justify-between p-3 sm:p-4 border-b border-muted bg-white shadow-sm">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={handleBackClick} 
            className="mr-2 sm:mr-3 p-1.5 text-kitchen-dark rounded-full hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/39f717d2-59da-48cf-9598-a998871f5d86.png" 
            alt="KOFFA Logo" 
            className="h-8 sm:h-10" 
          />
          {title && <span className="ml-2 sm:ml-3 text-base sm:text-lg font-semibold hidden sm:inline">{title}</span>}
        </Link>
      </div>
      {title && <span className="text-base sm:text-lg font-semibold sm:hidden">{title}</span>}
      {showSettings && (
        <div className="flex gap-1 sm:gap-2 items-center">
          <Link to="/profile" className="p-1.5 sm:p-2 rounded-full text-kitchen-dark hover:bg-muted">
            <User size={isMobile ? 18 : 20} />
          </Link>
          <Link to="/notifications" className="p-1.5 sm:p-2 rounded-full text-kitchen-dark hover:bg-muted relative">
            <Bell size={isMobile ? 18 : 20} />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-kitchen-berry text-white text-xs">
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Link>
          <button 
            onClick={handleSettingsClick}
            className="p-1.5 sm:p-2 rounded-full text-kitchen-dark hover:bg-muted" 
            aria-label="Settings"
          >
            <Settings size={isMobile ? 18 : 20} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
