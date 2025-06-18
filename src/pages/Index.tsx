
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { getLogoUrl } from "../utils/logoUpload";

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        
        if (currentUser) {
          // Redirect authenticated users to their respective dashboards
          if (currentUser.role === 'hirer') {
            navigate('/hirer-dashboard', { replace: true });
          } else if (currentUser.role === 'seeker') {
            navigate('/seeker-dashboard', { replace: true });
          }
        } else {
          // Redirect to splash screen for new users
          navigate('/splash', { replace: true });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Fallback to splash screen
        navigate('/splash', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isChecking) {
    return null; // Don't render anything once redirect is happening
  }

  // Show loading state while checking auth
  return (
    <div className="mobile-container bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-24 w-24 mx-auto mb-6 animate-spin">
          <img
            src={getLogoUrl()}
            alt="ReintegrateMe Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.log('Logo failed to load on index, using fallback');
              e.currentTarget.src = "/lovable-uploads/354e6306-e216-4b62-9bbc-24433bcbcc1f.png";
            }}
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">ReintegrateMe</h1>
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
