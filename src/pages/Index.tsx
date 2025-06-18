
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { getLogoUrl, getFallbackLogoUrl } from "../utils/logoUpload";

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked) {
      console.log('Index: Already checked auth, skipping');
      return;
    }

    const checkAuth = async () => {
      try {
        console.log('Index: Checking authentication');
        setHasChecked(true);
        
        const currentUser = authAPI.getCurrentUser();
        
        if (currentUser) {
          console.log('Index: User authenticated, role:', currentUser.role);
          // Redirect authenticated users to their respective dashboards
          if (currentUser.role === 'hirer') {
            navigate('/hirer-dashboard', { replace: true });
          } else if (currentUser.role === 'seeker') {
            navigate('/seeker-dashboard', { replace: true });
          } else {
            // Fallback for users without proper role
            navigate('/splash', { replace: true });
          }
        } else {
          console.log('Index: No authenticated user, redirecting to splash');
          // Redirect to splash screen for new users
          navigate('/splash', { replace: true });
        }
      } catch (error) {
        console.error('Index: Error checking auth:', error);
        // Fallback to splash screen
        if (!hasChecked) {
          navigate('/splash', { replace: true });
        }
      } finally {
        setTimeout(() => {
          setIsChecking(false);
        }, 1000);
      }
    };

    checkAuth();
  }, [navigate, hasChecked]);

  const handleLogoError = () => {
    console.log('Primary logo failed to load on index, trying fallback');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log('Logo loaded successfully on index');
    setLogoError(false);
  };

  if (!isChecking) {
    return null; // Don't render anything once redirect is happening
  }

  const logoUrl = logoError ? getFallbackLogoUrl() : getLogoUrl();

  // Show loading state while checking auth
  return (
    <div className="mobile-container bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-24 w-24 mx-auto mb-6 animate-spin">
          <img
            src={logoUrl}
            alt="ReintegrateMe Logo"
            className="w-full h-full object-contain"
            onError={handleLogoError}
            onLoad={handleLogoLoad}
            loading="eager"
            style={{ imageRendering: 'auto' }}
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">ReintegrateMe</h1>
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
