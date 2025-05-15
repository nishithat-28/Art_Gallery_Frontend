import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { OrderService, CreateOrderDto } from '../../../../core/services/order.service';
import { PaymentService, PaymentMethod, PaymentIntent } from '../../../../core/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddPaymentMethodComponent } from '../add-payment-method/add-payment-method.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  loading = false;
  error: string | null = null;
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;
  paymentIntent: PaymentIntent | null = null;
  showPaymentDialog = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['US', [Validators.required]],
      paymentMethod: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCart();
    this.loadPaymentMethods();
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

  private loadPaymentMethods(): void {
    this.paymentService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        const defaultMethod = methods.find(m => m.isDefault);
        if (defaultMethod) {
          this.selectedPaymentMethod = defaultMethod;
          this.checkoutForm.patchValue({ paymentMethod: defaultMethod.id });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to load payment methods', 'Close', { duration: 3000 });
      }
    });
  }

  onPaymentMethodChange(methodId: string): void {
    this.selectedPaymentMethod = this.paymentMethods.find(m => m.id === methodId) || null;
  }

  showAddPaymentMethod(): void {
    this.showPaymentDialog = true;
    const dialogRef = this.dialog.open(AddPaymentMethodComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showPaymentDialog = false;
      if (result) {
        this.loadPaymentMethods();
      }
    });
  }

  onPaymentMethodAdded(): void {
    this.showPaymentDialog = false;
    this.loadPaymentMethods();
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.valid) {
      this.loading = true;
      
      try {
        // Create payment intent
        this.paymentService.createPaymentIntent(this.cartTotal).subscribe({
          next: (intent) => {
            this.paymentIntent = intent;
            
            // Confirm payment
            this.paymentService.confirmPayment(
              intent.id,
              this.checkoutForm.get('paymentMethod')?.value
            ).subscribe({
              next: (confirmedIntent) => {
                if (confirmedIntent.status === 'succeeded') {
                  this.createOrder();
                } else {
                  this.loading = false;
                  this.error = 'Payment failed. Please try again.';
                  this.snackBar.open(this.error, 'Close', { duration: 3000 });
                }
              },
              error: (error) => {
                this.loading = false;
                this.error = 'Payment failed. Please try again.';
                this.snackBar.open(this.error, 'Close', { duration: 3000 });
              }
            });
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Failed to initialize payment. Please try again.';
            this.snackBar.open(this.error, 'Close', { duration: 3000 });
          }
        });
      } catch (error) {
        this.loading = false;
        this.error = 'An unexpected error occurred. Please try again.';
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  private createOrder(): void {
    const shippingAddress = {
      street: this.checkoutForm.get('address')?.value,
      city: this.checkoutForm.get('city')?.value,
      state: this.checkoutForm.get('state')?.value,
      zipCode: this.checkoutForm.get('zipCode')?.value,
      country: this.checkoutForm.get('country')?.value
    };

    this.orderService.createOrder(this.cartItems, shippingAddress).subscribe({
      next: (order) => {
        this.loading = false;
        this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
        this.cartService.clearCart().subscribe(() => {
          this.router.navigate(['/orders', order.id]);
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to place order. Please try again.';
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  retryLoading(): void {
    this.loadCart();
  }
} 