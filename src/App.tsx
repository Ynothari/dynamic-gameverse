
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ChessGame from "./pages/games/ChessGame";
import LudoGame from "./pages/games/LudoGame";
import SnakeLadderGame from "./pages/games/SnakeLadderGame";
import TicTacToeGame from "./pages/games/TicTacToeGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="games/chess" element={<ChessGame />} />
            <Route path="games/ludo" element={<LudoGame />} />
            <Route path="games/snake-ladder" element={<SnakeLadderGame />} />
            <Route path="games/tic-tac-toe" element={<TicTacToeGame />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
