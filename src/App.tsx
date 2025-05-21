
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import RoleSelection from "./components/RoleSelection";
import Authentication from "./components/Authentication";
import HirerProfileSetup from "./components/hirer/HirerProfileSetup";
import SeekerProfileSetupStep1 from "./components/seeker/SeekerProfileSetupStep1";
import SeekerProfileSetupStep2 from "./components/seeker/SeekerProfileSetupStep2";
import SeekerProfileSetupStep3 from "./components/seeker/SeekerProfileSetupStep3";
import HirerDashboard from "./components/hirer/HirerDashboard";
import SeekerDashboard from "./components/seeker/SeekerDashboard";
import MobileNavbar from "./components/MobileNavbar";
import { authAPI } from "./services/api";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/auth" element={<Authentication />} />
            
            {/* Hirer Routes */}
            <Route path="/hirer-setup" element={<HirerProfileSetup />} />
            <Route path="/hirer-dashboard" element={<HirerDashboard />} />
            <Route path="/hirer-discover" element={<HirerDashboard />} />
            
            {/* Seeker Routes */}
            <Route path="/seeker-setup-step1" element={<SeekerProfileSetupStep1 />} />
            <Route path="/seeker-setup-step2" element={<SeekerProfileSetupStep2 />} />
            <Route path="/seeker-setup-step3" element={<SeekerProfileSetupStep3 />} />
            <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {isAuthenticated && <MobileNavbar />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
