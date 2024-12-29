import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('access_token');
  
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      withCredentials: true
    });
    return next(cloned);
  }
  
  const requestWithCredentials = req.clone({
    withCredentials: true
  });
  return next(requestWithCredentials);
}; 