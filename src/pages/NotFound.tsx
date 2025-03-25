
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gamepad2 } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Gamepad2 className="h-16 w-16 text-game-accent mx-auto mb-6 animate-float" />
        <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Game not found</p>
        
        <Link to="/" className="game-button inline-flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
