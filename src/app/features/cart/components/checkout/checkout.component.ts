import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { OrderService, CreateOrderDto } from '../../../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && cartItems.length === 0" class="text-center py-8">
        <p class="text-gray-500 text-lg">Your cart is empty.</p>
        <button
          class="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          routerLink="/artworks"
        >
          Continue Shopping
        </button>
      </div>

      <div *ngIf="!loading && cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Shipping Information -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    formControlName="firstName"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <div *ngIf="checkoutForm.get('firstName')?.touched && checkoutForm.get('firstName')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    First name is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    formControlName="lastName"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <div *ngIf="checkoutForm.get('lastName')?.touched && checkoutForm.get('lastName')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    Last name is required
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    formControlName="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <div *ngIf="checkoutForm.get('email')?.touched && checkoutForm.get('email')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    Email is required
                  </div>
                  <div *ngIf="checkoutForm.get('email')?.touched && checkoutForm.get('email')?.errors?.['email']" class="text-red-500 text-sm mt-1">
                    Please enter a valid email address
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    formControlName="street"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <div *ngIf="checkoutForm.get('street')?.touched && checkoutForm.get('street')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    Street address is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    formControlName="city"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <div *ngIf="checkoutForm.get('city')?.touched && checkoutForm.get('city')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    City is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    formControlName="state"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <div *ngIf="checkoutForm.get('state')?.touched && checkoutForm.get('state')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    State is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    formControlName="zipCode"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                  <div *ngIf="checkoutForm.get('zipCode')?.touched && checkoutForm.get('zipCode')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    ZIP code is required
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    formControlName="country"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value="US"
                    readonly
                  >
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    formControlName="cardNumber"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="1234 5678 9012 3456"
                  >
                  <div *ngIf="checkoutForm.get('cardNumber')?.touched && checkoutForm.get('cardNumber')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                    Card number is required
                  </div>
                  <div *ngIf="checkoutForm.get('cardNumber')?.touched && checkoutForm.get('cardNumber')?.errors?.['pattern']" class="text-red-500 text-sm mt-1">
                    Please enter a valid 16-digit card number
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      formControlName="expiryDate"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="MM/YY"
                    >
                    <div *ngIf="checkoutForm.get('expiryDate')?.touched && checkoutForm.get('expiryDate')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                      Expiry date is required
                    </div>
                    <div *ngIf="checkoutForm.get('expiryDate')?.touched && checkoutForm.get('expiryDate')?.errors?.['pattern']" class="text-red-500 text-sm mt-1">
                      Please enter a valid expiry date (MM/YY)
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      formControlName="cvv"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="123"
                    >
                    <div *ngIf="checkoutForm.get('cvv')?.touched && checkoutForm.get('cvv')?.errors?.['required']" class="text-red-500 text-sm mt-1">
                      CVV is required
                    </div>
                    <div *ngIf="checkoutForm.get('cvv')?.touched && checkoutForm.get('cvv')?.errors?.['pattern']" class="text-red-500 text-sm mt-1">
                      Please enter a valid CVV (3-4 digits)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              [disabled]="checkoutForm.invalid || processing"
            >
              {{processing ? 'Processing...' : 'Place Order'}}
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div class="space-y-4">
              <div *ngFor="let item of cartItems" class="flex items-center py-2 border-b">
                <img [src]="item.artwork.imageUrl" [alt]="item.artwork.title" class="w-16 h-16 object-cover rounded-md">
                <div class="ml-4 flex-grow">
                  <h3 class="text-sm font-medium text-gray-900">{{item.artwork.title}}</h3>
                  <p class="text-sm text-gray-500">Qty: {{item.quantity}}</p>
                </div>
                <p class="text-sm font-medium text-gray-900">{{item.artwork.price * item.quantity | currency}}</p>
              </div>
              
              <div class="border-t pt-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-900">{{cartTotal | currency}}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">Shipping</span>
                  <span class="text-gray-900">Free</span>
                </div>
                
                <div class="flex justify-between font-semibold">
                  <span class="text-gray-900">Total</span>
                  <span class="text-gray-900">{{cartTotal | currency}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  checkoutForm: FormGroup;
  loading = false;
  processing = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['US'],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: (items: CartItem[]) => {
        this.cartItems = items;
        this.cartTotal = this.cartService.getCartTotal();
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
      const orderData: CreateOrderDto = {
        items: this.cartItems.map(item => ({
          id: item.artwork.id.toString(),
          price: item.artwork.price,
          quantity: item.quantity,
          title: item.artwork.title,
          imageUrl: item.artwork.imageUrl
        })),
        shippingAddress: {
          street: this.checkoutForm.get('street')?.value,
          city: this.checkoutForm.get('city')?.value,
          state: this.checkoutForm.get('state')?.value,
          country: this.checkoutForm.get('country')?.value,
          zipCode: this.checkoutForm.get('zipCode')?.value
        }
      };

      this.orderService.createOrder(this.cartItems, this.checkoutForm.get('cardNumber')?.value).subscribe({
        next: (order: any) => {
          this.cartService.clearCart().subscribe(() => {
            this.snackBar.open('Order placed successfully!', 'Close', {
              duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/orders', order.id]);
        });
      },
      error: (error: Error) => {
          console.error('Error creating order:', error);
          this.snackBar.open('Error placing order. Please try again.', 'Close', {
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