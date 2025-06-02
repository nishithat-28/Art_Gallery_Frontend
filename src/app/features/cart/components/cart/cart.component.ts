import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ArtworkService } from 'src/app/core/services/artwork.service';

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

  fallbackImageUrl: SafeUrl = 'https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk=';

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private artworkService: ArtworkService
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
        this.cartItems.forEach(item => this.loadArtworkImage(item));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load cart items. Please try again.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  private loadArtworkImage(item: any): void {
    this.artworkService.getArtworkImage(item.artwork.id).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        item.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        console.warn(`Failed to load image for artwork ID: ${item.artwork.id}`);
        item.imageUrl = this.fallbackImageUrl;
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
