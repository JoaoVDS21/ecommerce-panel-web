import { jwtDecode } from 'jwt-decode';
import { Tenant } from '@/types/tenant';
import { User } from '@/types/auth';

interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  tenant_id: string;
  exp: number;
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getUserFromToken = (token: string): User | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
  };
};

export const getTenantFromToken = (token: string): Tenant | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.tenant_id) return null;
  
  return {
    id: decoded.tenant_id,
    name: `Tenant ${decoded.tenant_id}`, // Normalmente você buscaria o nome do tenant de uma API
  };
};