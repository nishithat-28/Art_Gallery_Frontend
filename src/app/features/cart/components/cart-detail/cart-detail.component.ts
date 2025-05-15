import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div *ngIf="cartItems.length === 0" class="text-center py-8">
        <p class="text-gray-500 text-lg">Your cart is empty.</p>
        <button
          class="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          routerLink="/artworks"
        >
          Continue Shopping
        </button>
      </div>

      <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <div *ngFor="let item of cartItems" class="flex items-center py-4 border-b last:border-b-0">
                <img [src]="item.artwork.imageUrl" [alt]="item.artwork.title" class="w-24 h-24 object-cover rounded-md">
                
                <div class="ml-4 flex-grow">
                  <h3 class="text-lg font-semibold text-gray-900">{{item.artwork.title}}</h3>
                  <p class="text-sm text-gray-600">by {{item.artwork.artistName}}</p>
                  <p class="text-sm text-gray-500">{{item.artwork.category}}</p>
                </div>

                <div class="flex items-center space-x-4">
                  <div class="flex items-center border rounded-md">
                    <button
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      (click)="updateQuantity(item.artwork.id, item.quantity - 1)"
                      [disabled]="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="px-3 py-1">{{item.quantity}}</span>
                    <button
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      (click)="updateQuantity(item.artwork.id, item.quantity + 1)"
                    >
                      +
                    </button>
                  </div>

                  <div class="text-right">
                    <p class="text-lg font-semibold text-gray-900">{{item.artwork.price * item.quantity | currency}}</p>
                    <p class="text-sm text-gray-500">{{item.artwork.price | currency}} each</p>
                  </div>

                  <button
                    class="text-red-600 hover:text-red-700"
                    (click)="removeItem(item.artwork.id)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="text-gray-900">{{cartTotal | currency}}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="text-gray-900">Free</span>
              </div>
              
              <div class="border-t pt-4">
                <div class="flex justify-between">
                  <span class="text-lg font-semibold text-gray-900">Total</span>
                  <span class="text-lg font-semibold text-gray-900">{{cartTotal | currency}}</span>
                </div>
              </div>
            </div>

            <button
              class="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              (click)="proceedToCheckout()"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CartDetailComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }
  private loadCart(): void {
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
  }

  updateQuantity(artworkId: number, quantity: number): void {
    this.cartService.updateQuantity(artworkId, quantity);
  }

  removeItem(artworkId: number): void {
    this.cartService.removeFromCart(artworkId);
    this.snackBar.open('Item removed from cart', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/cart/checkout']);
  }
} 

function updateQuantity(artworkId: any, number: any, quantity: any, number1: any) {
  throw new Error('Function not implemented.');
}


function removeItem(artworkId: any, number: any) {
  throw new Error('Function not implemented.');
}


function proceedToCheckout() {
  throw new Error('Function not implemented.');
}
