
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    
    if (currentUser) {
      // Redirect authenticated users to their respective dashboards
      if (currentUser.role === 'hirer') {
        navigate('/hirer-dashboard');
      } else if (currentUser.role === 'seeker') {
        navigate('/seeker-dashboard');
      }
    } else {
      // Redirect to splash screen for new users
      navigate('/splash');
    }
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="mobile-container bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-24 w-24 mx-auto mb-6 animate-spin">
          <img
            src="/lovable-uploads/354e6306-e216-4b62-9bbc-24433bcbcc1f.png"
            alt="ReintegrateMe Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">ReintegrateMe</h1>
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
