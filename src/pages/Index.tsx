
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
    <div className="mobile-container bg-gradient-to-br from-blue-600 to-orange-500 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-24 w-24 mx-auto mb-6 rounded-2xl bg-white flex items-center justify-center shadow-2xl animate-spin">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            RM
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">ReintegrateMe</h1>
        <p className="text-blue-100 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
