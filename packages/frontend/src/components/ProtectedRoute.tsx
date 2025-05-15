import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate('/login', { state: { from: location }, replace: true });
          return;
        }

        if (authService.isTokenExpiringSoon()) {
          console.warn('Token is expiring soon');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login', { state: { from: location }, replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Verificando autenticação...</div>
      </div>
    );
  }

  return <>{children}</>;
} 