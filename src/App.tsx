
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import RoleSelection from "./components/RoleSelection";
import Authentication from "./components/Authentication";
import HirerProfileSetup from "./components/hirer/HirerProfileSetup";
import SeekerProfileSetupStep1 from "./components/seeker/SeekerProfileSetupStep1";
import SeekerProfileSetupStep2 from "./components/seeker/SeekerProfileSetupStep2";
import SeekerProfileSetupStep3 from "./components/seeker/SeekerProfileSetupStep3";
import SeekerProfileSetupStep4 from "./components/seeker/SeekerProfileSetupStep4";
import HirerDashboard from "./components/hirer/HirerDashboard";
import HirerDiscover from "./components/hirer/HirerDiscover";
import HirerJobsList from "./components/hirer/HirerJobsList";
import HirerCreateJob from "./components/hirer/HirerCreateJob";
import HirerApplicants from "./components/hirer/HirerApplicants";
import HirerMessages from "./components/hirer/HirerMessages";
import HirerChatDetail from "./components/hirer/HirerChatDetail";
import SeekerHome from "./components/seeker/SeekerHome";
import SeekerDashboard from "./components/seeker/SeekerDashboard";
import SeekerApplications from "./components/seeker/SeekerApplications";
import SeekerMessages from "./components/seeker/SeekerMessages";
import SeekerChatDetail from "./components/seeker/SeekerChatDetail";
import SeekerProfile from "./components/seeker/SeekerProfile";
import SeekerSaved from "./components/seeker/SeekerSaved";
import SeekerAISuite from "./components/seeker/SeekerAISuite";
import SeekerAICoach from "./components/seeker/SeekerAICoach";
import SeekerCVBuilder from "./components/seeker/SeekerCVBuilder";
import MobileNavbar from "./components/MobileNavbar";
import MainMenu from "./components/MainMenu";
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
          {/* Add MainMenu for hamburger navigation */}
          <MainMenu />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/auth" element={<Authentication />} />
            
            {/* Hirer Routes */}
            <Route path="/hirer-setup" element={<HirerProfileSetup />} />
            <Route path="/hirer-dashboard" element={<HirerDashboard />} />
            <Route path="/hirer-discover" element={<HirerDiscover />} />
            <Route path="/hirer-jobs" element={<HirerJobsList />} />
            <Route path="/hirer-create-job" element={<HirerCreateJob />} />
            <Route path="/hirer-applicants" element={<HirerApplicants />} />
            <Route path="/hirer-messages" element={<HirerMessages />} />
            <Route path="/hirer-messages/:threadId" element={<HirerChatDetail />} />
            <Route path="/hirer-profile" element={<Navigate to="/hirer-dashboard" replace />} />
            
            {/* Seeker Routes */}
            <Route path="/seeker-setup-step1" element={<SeekerProfileSetupStep1 />} />
            <Route path="/seeker-setup-step2" element={<SeekerProfileSetupStep2 />} />
            <Route path="/seeker-setup-step3" element={<SeekerProfileSetupStep3 />} />
            <Route path="/seeker-setup-step4" element={<SeekerProfileSetupStep4 />} />
            <Route path="/seeker-dashboard" element={<SeekerHome />} />
            <Route path="/seeker-discover" element={<SeekerDashboard />} />
            <Route path="/seeker-applications" element={<SeekerApplications />} />
            <Route path="/seeker-messages" element={<SeekerMessages />} />
            <Route path="/seeker-messages/:conversationId" element={<SeekerChatDetail />} />
            <Route path="/seeker-profile" element={<SeekerProfile />} />
            <Route path="/seeker-saved" element={<SeekerSaved />} />
            <Route path="/seeker-ai-suite" element={<SeekerAISuite />} />
            <Route path="/seeker-ai-coach" element={<SeekerAICoach />} />
            <Route path="/seeker-cv-builder" element={<SeekerCVBuilder />} />
            <Route path="/seeker-search" element={<Navigate to="/seeker-discover" replace />} />
            
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
