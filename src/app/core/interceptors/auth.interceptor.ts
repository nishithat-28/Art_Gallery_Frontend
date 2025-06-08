import { Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //constructor(private authService: AuthService) {}
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log('Auth Interceptor - Processing request:', {
      url: request.url,
      hasToken: !!token,
      method: request.method
    });

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Auth Interceptor - Added token to request');
    } else {
      console.warn('Auth Interceptor - No token available for request:', request.url);
    }

    return next.handle(request);
  }
} 