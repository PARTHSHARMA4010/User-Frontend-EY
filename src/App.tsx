import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// --- IMPORT OUR NEW VOICE FEATURES ---
import { VoiceProvider } from "./contexts/VoiceContext";
import VoiceAgent from "./components/VoiceAgent";

const queryClient = new QueryClient();

// --- 1. THE GUARD (Protects your Dashboard) ---
// This checks if "currentUser" is saved in the browser.
// If NOT, it forces the user to go to "/login".
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('currentUser');
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* --- 2. WRAP APP IN VOICE PROVIDER --- */}
        <VoiceProvider>
          
          {/* --- 3. FLOATING MIC BUTTON --- */}
          <VoiceAgent />
          
          <Routes>
            {/* --- PUBLIC ROUTE (Accessible by anyone) --- */}
            <Route path="/login" element={<Login />} />

            {/* --- PROTECTED ROUTES (Only accessible if logged in) --- */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/bookings" 
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              } 
            />

            {/* --- CATCH ALL (404) --- */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </VoiceProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;