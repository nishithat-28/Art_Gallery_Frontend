import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <a routerLink="/" class="text-2xl font-bold text-gray-800">Art Gallery</a>
          
          <div class="flex items-center space-x-4">
            <a routerLink="/artworks" class="text-gray-600 hover:text-gray-900">Browse Art</a>
            <a routerLink="/orders" class="text-gray-600 hover:text-gray-900">Orders</a>
            <a routerLink="/cart" class="text-gray-600 hover:text-gray-900">Cart</a>
            
            <ng-container *ngIf="isLoggedIn; else authButtons">
              <a routerLink="/admin" class="text-gray-600 hover:text-gray-900">Admin</a>
              <button (click)="logout()" class="text-gray-600 hover:text-gray-900">Logout</button>
            </ng-container>
            
            <ng-template #authButtons>
              <a routerLink="/auth/login" class="text-gray-600 hover:text-gray-900">Login</a>
              <a routerLink="/auth/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Sign Up
              </a>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  isLoggedIn = false;

  constructor(private router: Router) {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
} 