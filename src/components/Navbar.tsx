
import { Link, useLocation } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-game-border backdrop-blur-sm bg-game-dark/90 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-game-accent font-bold text-xl transition-all duration-300 hover:scale-105"
          >
            <Gamepad2 className="h-6 w-6" />
            <span>Tech Tactics</span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'text-game-accent after:scale-x-100' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/games/chess" 
              className={`nav-link ${isActive('/games/chess') ? 'text-game-accent after:scale-x-100' : ''}`}
            >
              Chess
            </Link>
            <Link 
              to="/games/ludo" 
              className={`nav-link ${isActive('/games/ludo') ? 'text-game-accent after:scale-x-100' : ''}`}
            >
              Ludo
            </Link>
            <Link 
              to="/games/snake-ladder" 
              className={`nav-link ${isActive('/games/snake-ladder') ? 'text-game-accent after:scale-x-100' : ''}`}
            >
              Snake & Ladder
            </Link>
            <Link 
              to="/games/tic-tac-toe" 
              className={`nav-link ${isActive('/games/tic-tac-toe') ? 'text-game-accent after:scale-x-100' : ''}`}
            >
              Tic Tac Toe
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
