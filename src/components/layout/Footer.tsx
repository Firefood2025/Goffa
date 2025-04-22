
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, RefrigeratorIcon, ShoppingCart } from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-muted shadow-md z-10">
      <nav className="grid grid-cols-4 h-16">
        <Link to="/" className={`bottom-nav-button ${isActive('/') ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        
        <Link to="/recipes" className={`bottom-nav-button ${isActive('/recipes') ? 'active' : ''}`}>
          <BookOpen size={20} />
          <span>Recipes</span>
        </Link>
        
        <Link to="/pantry" className={`bottom-nav-button ${isActive('/pantry') ? 'active' : ''}`}>
          <RefrigeratorIcon size={20} />
          <span>Pantry</span>
        </Link>
        
        <Link to="/shopping-list" className={`bottom-nav-button ${isActive('/shopping-list') ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          <span>List</span>
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
