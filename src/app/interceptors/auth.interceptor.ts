import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip auth headers during SSR
  if (typeof window === 'undefined') {
    return next(req);
  }

  // Skip auth for public endpoints
  const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh', '/api/public'];
  const isPublicEndpoint = publicEndpoints.some(endpoint =>
    req.url.includes(endpoint) || req.url.includes('assets/')
  );

  if (isPublicEndpoint) {
    return next(req);
  }

  // Get token from localStorage - check multiple possible keys
  const tokenKeys = ['token', 'authToken', 'accessToken', 'jwt'];
  let token: string | null = null;

  for (const key of tokenKeys) {
    token = localStorage.getItem(key);
    if (token) break;
  }

  if (token) {
    try {
      // Decode JWT payload
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token is expired
      if (tokenData.exp && tokenData.exp < currentTime) {
        console.warn('⚠️ Token expiré');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('jwt');
        return next(req);
      }
    } catch (error) {
      console.error('❌ Format de token invalide:', error);
    }

    // Clone request & add Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('👉 Authorization header ajouté:', authReq.headers.get('Authorization'));
    return next(authReq);
  }

  // No token found
  return next(req);
};
