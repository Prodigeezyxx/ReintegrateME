
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import UnifiedAuth from "./components/UnifiedAuth";
import RoleSelection from "./components/RoleSelection";
import ProtectedRoute from "./components/ProtectedRoute";
import HirerProfileSetup from "./components/hirer/HirerProfileSetup";
import SeekerProfileSetupStep1 from "./components/seeker/SeekerProfileSetupStep1";
import SeekerProfileSetupStep2 from "./components/seeker/SeekerProfileSetupStep2";
import SeekerProfileSetupStep3 from "./components/seeker/SeekerProfileSetupStep3";
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
import SeekerProfile from "./components/seeker/SeekerProfile";
import SeekerSaved from "./components/seeker/SeekerSaved";
import SeekerAISuite from "./components/seeker/SeekerAISuite";
import SeekerAICoach from "./components/seeker/SeekerAICoach";
import SeekerAIChat from "./components/seeker/SeekerAIChat";
import SeekerCVBuilder from "./components/seeker/SeekerCVBuilder";
import MobileNavbar from "./components/MobileNavbar";
import MainMenu from "./components/MainMenu";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  
  console.log('AppContent - loading:', loading, 'user:', user);
  
  return (
    <>
      {/* Add MainMenu for hamburger navigation */}
      <MainMenu />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/unified-auth" element={<UnifiedAuth />} />
        <Route path="/role-selection" element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        } />
        
        {/* Hirer Routes */}
        <Route path="/hirer-setup" element={
          <ProtectedRoute requireRole="hirer">
            <HirerProfileSetup />
          </ProtectedRoute>
        } />
        <Route path="/hirer-dashboard" element={
          <ProtectedRoute requireRole="hirer">
            <HirerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/hirer-discover" element={
          <ProtectedRoute requireRole="hirer">
            <HirerDiscover />
          </ProtectedRoute>
        } />
        <Route path="/hirer-jobs" element={
          <ProtectedRoute requireRole="hirer">
            <HirerJobsList />
          </ProtectedRoute>
        } />
        <Route path="/hirer-create-job" element={
          <ProtectedRoute requireRole="hirer">
            <HirerCreateJob />
          </ProtectedRoute>
        } />
        <Route path="/hirer-applicants" element={
          <ProtectedRoute requireRole="hirer">
            <HirerApplicants />
          </ProtectedRoute>
        } />
        <Route path="/hirer-messages" element={
          <ProtectedRoute requireRole="hirer">
            <HirerMessages />
          </ProtectedRoute>
        } />
        <Route path="/hirer-messages/:threadId" element={
          <ProtectedRoute requireRole="hirer">
            <HirerChatDetail />
          </ProtectedRoute>
        } />
        <Route path="/hirer-profile" element={<Navigate to="/hirer-dashboard" replace />} />
        
        {/* Seeker Routes */}
        <Route path="/seeker-setup-step1" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerProfileSetupStep1 />
          </ProtectedRoute>
        } />
        <Route path="/seeker-setup-step2" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerProfileSetupStep2 />
          </ProtectedRoute>
        } />
        <Route path="/seeker-setup-step3" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerProfileSetupStep3 />
          </ProtectedRoute>
        } />
        <Route path="/seeker-dashboard" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerHome />
          </ProtectedRoute>
        } />
        <Route path="/seeker-discover" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/seeker-applications" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerApplications />
          </ProtectedRoute>
        } />
        <Route path="/seeker-messages" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerMessages />
          </ProtectedRoute>
        } />
        <Route path="/seeker-profile" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerProfile />
          </ProtectedRoute>
        } />
        <Route path="/seeker-saved" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerSaved />
          </ProtectedRoute>
        } />
        <Route path="/seeker-ai-suite" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerAISuite />
          </ProtectedRoute>
        } />
        <Route path="/seeker-ai-coach" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerAICoach />
          </ProtectedRoute>
        } />
        <Route path="/seeker-ai-chat" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerAIChat />
          </ProtectedRoute>
        } />
        <Route path="/seeker-cv-builder" element={
          <ProtectedRoute requireRole="seeker">
            <SeekerCVBuilder />
          </ProtectedRoute>
        } />
        <Route path="/seeker-search" element={<Navigate to="/seeker-discover" replace />} />
        
        {/* Redirect old auth route to new unified auth */}
        <Route path="/auth" element={<Navigate to="/unified-auth" replace />} />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {user && <MobileNavbar />}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
