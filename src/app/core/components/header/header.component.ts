import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <!-- Top Bar -->
      <div class="bg-gray-900 text-white py-2">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center text-sm">
            <div class="flex space-x-4">
              <a href="tel:+1234567890" class="hover:text-gray-300">
                <i class="material-icons text-sm align-middle mr-1">phone</i>
                +1 (234) 567-890
              </a>
              <a href="mailto:support@artgallery.com" class="hover:text-gray-300">
                <i class="material-icons text-sm align-middle mr-1">email</i>
                support@artgallery.com
              </a>
            </div>
            <div class="flex space-x-4">
              <a routerLink="/about" class="hover:text-gray-300">About Us</a>
              <a routerLink="/contact" class="hover:text-gray-300">Contact</a>
              <a routerLink="/faq" class="hover:text-gray-300">FAQ</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Navigation -->
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center space-x-2">
            <i class="material-icons text-3xl text-blue-600">brush</i>
            <span class="text-2xl font-bold text-gray-900">ArtGallery</span>
          </a>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Search for artwork..."
                class="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i class="material-icons">search</i>
              </button>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center gap-4">
            <!-- Categories Dropdown -->
            <div class="relative group">
              <button class="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <i class="material-icons">category</i>
                <span>Categories</span>
                <i class="material-icons text-sm">arrow_drop_down</i>
              </button>
              <div class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <a routerLink="/artworks/paintings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Paintings</a>
                <a routerLink="/artworks/sculptures" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sculptures</a>
                <a routerLink="/artworks/photography" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Photography</a>
                <a routerLink="/artworks/digital" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Digital Art</a>
              </div>
            </div>

            <!-- Account -->
            <div class="relative group">
              <button class="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <i class="material-icons">account_circle</i>
                <span>Account</span>
                <i class="material-icons text-sm">arrow_drop_down</i>
              </button>
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <ng-container *ngIf="isLoggedIn$ | async; else loginLinks">
                  <a routerLink="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Profile</a>
                  <a routerLink="/wishlist" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Wishlist</a>
                  <button (click)="logout()" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </ng-container>
                <ng-template #loginLinks>
                  <a routerLink="/auth/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</a>
                  <a routerLink="/auth/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</a>
                </ng-template>
              </div>
            </div>

            <!-- Cart and Orders -->
            <div class="flex items-center gap-4">
              <a routerLink="/cart" class="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <i class="material-icons">shopping_cart</i>
                <span>Cart</span>
                <span *ngIf="cartItemCount$ | async as count" 
                      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{count}}
                </span>
              </a>

              <a routerLink="/orders" class="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <i class="material-icons">receipt_long</i>
                <span>Orders</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn$;
  cartItemCount$ = this.cartService.getCartItems().pipe(
    map(items => items.reduce((count, item) => count + item.quantity, 0))
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 