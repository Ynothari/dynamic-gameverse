
import { Link } from "react-router-dom";
import { Gamepad2, ChessBoard, DiceIcon, ArrowBigUp, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const games = [
  {
    id: "chess",
    title: "Chess",
    description: "The classic strategic board game of kings and queens.",
    icon: ChessBoard,
    path: "/games/chess",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    id: "ludo",
    title: "Ludo",
    description: "Race your pieces around the board in this game of chance.",
    icon: DiceIcon,
    path: "/games/ludo",
    color: "from-yellow-500/20 to-yellow-600/10",
  },
  {
    id: "snake-ladder",
    title: "Snake & Ladder",
    description: "Climb the ladders and avoid the snakes in this race to the top.",
    icon: ArrowBigUp,
    path: "/games/snake-ladder",
    color: "from-green-500/20 to-green-600/10",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "A 3x3 grid game where you place Xs and Os to win.",
    icon: XCircle,
    path: "/games/tic-tac-toe",
    color: "from-purple-500/20 to-purple-600/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Index = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-game-accent to-blue-400 text-transparent bg-clip-text">
            Welcome to Tech Tactics
          </h1>
          <Gamepad2 className="h-12 w-12 text-game-accent animate-float" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
          Choose a game to play from our collection of classic and modern favorites.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl"
      >
        {games.map((game) => (
          <motion.div key={game.id} variants={item}>
            <Link 
              to={game.path}
              className="group block"
            >
              <div className={`game-card h-full bg-gradient-to-br ${game.color}`}>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold">{game.title}</h2>
                  <game.icon className="h-6 w-6 text-game-accent group-hover:animate-pulse-gentle" />
                </div>
                <p className="text-muted-foreground mb-6">{game.description}</p>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-game-dark border border-game-border rounded-lg group-hover:border-game-accent/50 transition-colors duration-300">
                    Play Now
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;
