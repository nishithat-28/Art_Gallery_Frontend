import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';
import { OrderResponseDto } from '../../../../core/models/order.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ArtworkService } from 'src/app/core/services/artwork.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  cartTotal = 0;
  checkoutForm: FormGroup;
  loading = false;
  processing = false;
  error: string | null = null;

  fallbackImageUrl: SafeUrl = 'https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk=';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private artworkService: ArtworkService
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['India', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit(): void {
    this.loadCart();
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
  private loadCart(): void {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: (items: CartItem[]) => {
        this.cartItems = items;
        this.cartTotal = this.cartService.getCartTotal();
        this.cartItems.forEach(item => this.loadArtworkImage(item));
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error loading cart:', error);
        this.snackBar.open('Error loading cart. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.processing = true;
      
      // Validate cart items
      if (!this.cartItems || this.cartItems.length === 0) {
        this.snackBar.open('Your cart is empty. Please add items before placing an order.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.processing = false;
        return;
      }

      // Format shipping address
      const shippingAddress = this.orderService.formatShippingAddress({
        street: this.checkoutForm.get('street')?.value,
        city: this.checkoutForm.get('city')?.value,
        state: this.checkoutForm.get('state')?.value,
        country: this.checkoutForm.get('country')?.value,
        zipCode: this.checkoutForm.get('zipCode')?.value
      });

      // Get payment method (using card type from first 4 digits)
      const cardNumber = this.checkoutForm.get('cardNumber')?.value;
      let paymentMethod = 'Credit Card';
      if (cardNumber.startsWith('4')) {
        paymentMethod = 'Visa';
      } else if (cardNumber.startsWith('5')) {
        paymentMethod = 'Mastercard';
      } else if (cardNumber.startsWith('3')) {
        paymentMethod = 'American Express';
      }

      console.log('Submitting order with:', { 
        cartItems: this.cartItems,
        shippingAddress,
        paymentMethod
      });

      this.orderService.createOrder(shippingAddress, paymentMethod,this.cartItems).subscribe({
        next: (order: OrderResponseDto) => {
          console.log('Order created successfully:', order);
          this.cartService.clearCart().subscribe({
            next: () => {
              this.snackBar.open('Order placed successfully!', 'Close', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              this.router.navigate(['/orders', order.id]);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error clearing cart:', error);
              // Still navigate to order page even if cart clearing fails
              this.router.navigate(['/orders', order.id]);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating order:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url
          });
          
          let errorMessage = 'Error placing order. Please try again.';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          } else if (error.status === 401) {
            errorMessage = 'Please log in to place an order.';
          } else if (error.status === 400) {
            errorMessage = 'Invalid order data. Please check your cart and try again.';
          }

          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.processing = false;
        }
      });
    }
  }
} 