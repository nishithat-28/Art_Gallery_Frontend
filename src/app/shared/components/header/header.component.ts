import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <a routerLink="/" class="text-2xl font-bold text-gray-800">Art Gallery</a>
          
          <div class="flex items-center space-x-4">
            <a routerLink="/artworks" class="text-gray-600 hover:text-gray-900">Browse Art</a>
            <a routerLink="/artworks/sell-artwork" class="text-gray-600 hover:text-gray-900">Sell Art</a>
            <a routerLink="/orders" class="text-gray-600 hover:text-gray-900">Orders</a>
            <a routerLink="/cart" class="text-gray-600 hover:text-gray-900">Cart</a>

            
            <ng-container *ngIf="currentUser; else authButtons">
              <a routerLink="/profile" class="text-gray-600 hover:text-gray-900">{{ currentUser.firstName || 'User' }}'s<br>profile</a>
              <button (click)="logout()" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
            </ng-container>
            
            <ng-template #authButtons>
              <a routerLink="/auth/login" class="text-gray-600 hover:text-gray-900 hover:bg-gray-200 border border-blue-500 rounded-md px-4 py-2">Login</a>
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
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    // this.isLoggedIn = !!localStorage.getItem('token');
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
  }
} 