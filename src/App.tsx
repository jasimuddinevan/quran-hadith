import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import Index from "./pages/Index";
import Quran from "./pages/Quran";
import SurahReader from "./pages/SurahReader";
import Read from "./pages/Read";
import Hadith from "./pages/Hadith";
import Dua from "./pages/Dua";
import NamesOfAllah from "./pages/NamesOfAllah";
import Prayer from "./pages/Prayer";
import Settings from "./pages/Settings";
import Bookmarks from "./pages/Bookmarks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <BookmarkProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quran" element={<Quran />} />
              <Route path="/quran/:surahId" element={<SurahReader />} />
              <Route path="/read" element={<Read />} />
              <Route path="/hadith" element={<Hadith />} />
              <Route path="/dua" element={<Dua />} />
              <Route path="/names-of-allah" element={<NamesOfAllah />} />
              <Route path="/prayer" element={<Prayer />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookmarkProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
