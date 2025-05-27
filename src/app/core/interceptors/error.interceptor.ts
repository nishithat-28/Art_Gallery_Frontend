import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Making request to:', request.url);
    const token = localStorage.getItem('token');
    console.log('Token present:', !!token);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Error occurred:', error.status, error.statusText);
        console.log('Error details:', error.error);
        
        let errorMessage = 'An error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
          console.log('Client-side error:', errorMessage);
        } else {
          // Server-side error
          if (error.status === 401) {
            console.log('Unauthorized error - clearing token and redirecting to login');
            localStorage.removeItem('token');
            this.router.navigate(['/auth/login']);
            errorMessage = 'Session expired. Please login again.';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to perform this action.';
          } else if (error.status === 404) {
            errorMessage = 'The requested resource was not found.';
          } else if (error.status === 500) {
            errorMessage = 'Internal server error. Please try again later.';
          }
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });

        return throwError(() => error);
      })
    );
  }
}