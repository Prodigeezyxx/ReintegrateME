
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { getLogoUrl, getFallbackLogoUrl } from "../utils/logoUpload";

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked || hasNavigated) {
      console.log('Index: Already checked auth or navigated, skipping');
      return;
    }

    const checkAuth = async () => {
      try {
        console.log('Index: Starting authentication check');
        setHasChecked(true);
        
        // Force refresh of current user from localStorage
        const currentUser = authAPI.getCurrentUser();
        console.log('Index: Current user after check:', currentUser);
        
        if (currentUser && !hasNavigated) {
          console.log('Index: User authenticated, role:', currentUser.role);
          setHasNavigated(true);
          
          // Add a small delay to ensure smooth transition
          setTimeout(() => {
            // Redirect authenticated users to their respective dashboards
            if (currentUser.role === 'hirer') {
              console.log('Index: Redirecting hirer to talent overview');
              navigate('/hirer-talent-overview', { replace: true });
            } else if (currentUser.role === 'seeker') {
              console.log('Index: Redirecting seeker to dashboard');
              navigate('/seeker-dashboard', { replace: true });
            } else {
              // Fallback for users without proper role
              console.log('Index: Unknown role, redirecting to splash');
              navigate('/splash', { replace: true });
            }
          }, 100);
        } else if (!hasNavigated) {
          console.log('Index: No authenticated user, redirecting to splash');
          setHasNavigated(true);
          
          setTimeout(() => {
            // Redirect to splash screen for new users
            navigate('/splash', { replace: true });
          }, 100);
        }
      } catch (error) {
        console.error('Index: Error checking auth:', error);
        // Fallback to splash screen
        if (!hasChecked && !hasNavigated) {
          setHasNavigated(true);
          navigate('/splash', { replace: true });
        }
      } finally {
        setTimeout(() => {
          setIsChecking(false);
        }, 1000);
      }
    };

    checkAuth();
  }, [navigate, hasChecked, hasNavigated]);

  const handleLogoError = () => {
    console.log('Primary logo failed to load on index, trying fallback');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log('Logo loaded successfully on index');
    setLogoError(false);
  };

  if (!isChecking || hasNavigated) {
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
            alt="ReintegrateME Logo"
            className="w-full h-full object-contain"
            onError={handleLogoError}
            onLoad={handleLogoLoad}
            loading="eager"
            style={{ imageRendering: 'auto' }}
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">ReintegrateME</h1>
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
