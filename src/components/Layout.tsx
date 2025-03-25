
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="text-center py-6 text-muted-foreground text-sm border-t border-game-border">
        <p>© {new Date().getFullYear()} Tech Tactics. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
