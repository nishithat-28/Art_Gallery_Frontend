import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../../../core/services/order.service';
import { NotificationService, NotificationPreferences } from '../../../../core/services/notification.service';
import { OrderResponseDto, Address } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-details',
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
          <button
            class="text-blue-600 hover:text-blue-800 flex items-center"
            (click)="goBack()"
          >
            <span class="material-icons mr-1">arrow_back</span>
            Back to Orders
          </button>
        </div>

        <ng-container *ngIf="order; else loading">
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h1 class="text-2xl font-bold text-gray-900">
                Order #{{order.id}}
              </h1>
              <span
                [class]="getStatusClass(order.status)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{order.status}}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Shipping Information -->
              <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
                <div class="space-y-2">
                  <ng-container *ngIf="shippingAddress">
                    <div class="shipping-info">
                      <h3>Shipping Address</h3>
                      <p>{{shippingAddress.street}}</p>
                      <p>{{shippingAddress.city}}, {{shippingAddress.state}} {{shippingAddress.zipCode}}</p>
                      <p>{{shippingAddress.country}}</p>
                    </div>
                  </ng-container>
                </div>
              </div>

              <!-- Order Information -->
              <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Order Information</h2>
                <div class="space-y-2">
                  <p><span class="font-medium">Order Date:</span> {{order.orderDate | date}}</p>
                  <p><span class="font-medium">Payment Method:</span> {{order.paymentMethod}}</p>
                  <p><span class="font-medium">Invoice Number:</span> {{order.invoiceNumber}}</p>
                  <p><span class="font-medium">Total Amount:</span> {{order.totalAmount | currency}}</p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mt-6">
              <h2 class="text-xl font-semibold mb-4">Order Items</h2>
              <div class="space-y-4">
                <div *ngFor="let item of order.orderItems" class="flex items-center py-4 border-b last:border-b-0">
                  <div class="flex-grow">
                    <h3 class="font-medium">{{item.artWorkTitle}}</h3>
                    <p class="text-sm text-gray-600">Artist: {{item.artWorkArtist}}</p>
                    <p class="text-sm text-gray-600">Quantity: {{item.quantity}}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">{{item.price | currency}}</p>
                    <p class="text-sm text-gray-600">Subtotal: {{item.subtotal | currency}}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex flex-wrap gap-4">
              <button
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                (click)="viewInvoice()"
              >
                View Invoice
              </button>
              <button
                *ngIf="order.status === 'Pending'"
                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                (click)="cancelOrder()"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </ng-container>

        <ng-template #loading>
          <div class="flex justify-center items-center h-64">
            <mat-spinner diameter="48"></mat-spinner>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class OrderDetailsComponent implements OnInit {
  order: OrderResponseDto | null = null;
  loading = true;
  error: string | null = null;
  shippingAddress: Address | null = null;
  notificationPreferences: NotificationPreferences = {
    emailNotifications: true,
    orderUpdates: true,
    deliveryUpdates: true,
    marketingEmails: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error = 'Order ID not found';
      this.loading = false;
      return;
    }

    this.orderService.getOrder(Number(orderId)).subscribe({
      next: (order: OrderResponseDto) => {
        this.order = order;
        // Parse shipping address from string to Address object
        try {
          this.shippingAddress = JSON.parse(order.shippingAddress) as Address;
        } catch (e) {
          console.error('Error parsing shipping address:', e);
          this.shippingAddress = null;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.error = 'Error loading order details';
        this.loading = false;
      }
    });

    this.loadNotificationPreferences();
  }

  private loadNotificationPreferences(): void {
    this.notificationService.getNotificationPreferences().subscribe({
      next: (preferences: NotificationPreferences) => {
        this.notificationPreferences = preferences;
      },
      error: (error: unknown) => {
        console.error('Error loading notification preferences:', error);
        this.snackBar.open('Error loading notification preferences', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  updateNotificationPreferences(): void {
    if (!this.notificationPreferences) return;

    this.notificationService.updateNotificationPreferences(this.notificationPreferences).subscribe({
      next: (preferences: NotificationPreferences) => {
        this.notificationPreferences = preferences;
        this.snackBar.open('Notification preferences updated', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error: unknown) => {
        console.error('Error updating notification preferences:', error);
        this.snackBar.open('Error updating notification preferences', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  cancelOrder(): void {
    if (!this.order) {
      this.snackBar.open('Order not found.', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(this.order.id.toString()).subscribe({
        next: (updatedOrder) => {
          this.order = updatedOrder;
          this.snackBar.open('Order cancelled successfully.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.snackBar.open('Error cancelling order. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  printOrderDetails(): void {
    const printContent = document.getElementById('printTemplate');
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    
    // Reinitialize the component after printing
    this.ngOnInit();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-200 text-green-900';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  getOrderTotal(): number {
    return this.order?.totalAmount || 0;
  }

  getOrderItemsSummary(): string {
    if (!this.order?.orderItems) return '';
    return this.order.orderItems
      .map(item => `${item.artWorkTitle} (${item.quantity})`)
      .join(', ');
  }

  viewInvoice(): void {
    if (!this.order) return;
    // Navigate to invoice page
    window.open(`/orders/${this.order.id}/invoice`, '_blank');
  }
} 