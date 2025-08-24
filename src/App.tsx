
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Index from "./pages/Index";
import TrendingTopics from "./pages/TrendingTopics";
import TrendingResult from "./pages/TrendingResult";
import MapaLatam from "./pages/MapaLatam";
import NotFound from "./pages/NotFound";
import Medios from "./pages/Medios";
import Feed from "./pages/Feed";
import ResearchLoading from "./pages/ResearchLoading";
import Results from "./pages/Results";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/research-loading" element={<ResearchLoading />} />
              <Route path="/results" element={<Results />} />
                          <Route path="/trending" element={<TrendingTopics />} />
              <Route path="/trending-result/:slug" element={<TrendingResult />} />
              <Route path="/mapa-latam" element={<MapaLatam />} />
              <Route path="/medios" element={<Medios />} />
              <Route path="/feed" element={<Feed />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
