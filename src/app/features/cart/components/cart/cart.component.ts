import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  cartTotal = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.loading = true;
    this.error = null;

    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cartTotal = this.cartService.getCartTotal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load cart items. Please try again.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  updateQuantity(artworkId: number, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(artworkId, newQuantity).subscribe({
      next: () => {
        this.loadCart();
        this.snackBar.open('Cart updated', 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Failed to update cart', 'Close', { duration: 3000 });
      }
    });
  }

  removeItem(artworkId: number): void {
    this.cartService.removeFromCart(artworkId).subscribe({
      next: () => {
        this.loadCart();
        this.snackBar.open('Item removed from cart', 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Failed to remove item', 'Close', { duration: 3000 });
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/cart/checkout']);
  }

  retryLoading(): void {
    this.loadCart();
  }
} 