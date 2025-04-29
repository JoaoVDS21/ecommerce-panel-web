'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const { currentTenant } = useTenantStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Verifica se o usuário está na rota pública de login
      const isPublicRoute = window.location.pathname === '/login';
      
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login');
      } else if (isAuthenticated && isPublicRoute) {
        router.push('/products');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center">Carregando...</div>;
  }

  return <>{children}</>;
};
