import { Injectable } from '@angular/core';
import {CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
 
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Redirect to the login page if the user is not authenticated
      this.snackBar.open('Please log in to continue.', 'Close', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
      });
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
  
} 