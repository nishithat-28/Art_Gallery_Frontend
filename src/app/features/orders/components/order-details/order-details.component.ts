import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService, Order, TrackingEvent } from '../../../../core/services/order.service';
import { NotificationService, NotificationPreferences } from '../../../../core/services/notification.service';

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
                  <ng-container *ngIf="order.shippingAddress">
                    <div class="shipping-info">
                      <h3>Shipping Address</h3>
                      <p>{{order.shippingAddress.street}}</p>
                      <p>{{order.shippingAddress.city}}, {{order.shippingAddress.state}} {{order.shippingAddress.zipCode}}</p>
                      <p>{{order.shippingAddress.country}}</p>
                    </div>
                  </ng-container>
                </div>
              </div>

              <!-- Tracking Information -->
              <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Tracking Information</h2>
                <div class="space-y-2">
                  <p *ngIf="order.trackingNumber">Tracking Number: {{order.trackingNumber}}</p>
                  <p *ngIf="order.estimatedDeliveryDate">
                    Estimated Delivery: {{order.estimatedDeliveryDate | date}}
                  </p>
                </div>
              </div>
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
  order: Order | null = null;
  trackingEvents: TrackingEvent[] = [];
  loading = true;
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
    this.loadOrder();
    this.loadNotificationPreferences();
  }

  private loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.showError('Order ID not found');
      this.goBack();
      return;
    }
    this.loading = true;
    this.orderService.getOrder(orderId).subscribe({
      next: (order: Order) => {
        this.order = order;
        this.trackingEvents = this.orderService.getMockTrackingEvents(order);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.showError('Error loading order details');
        this.loading = false;
        this.goBack();
      }
    });
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
          this.trackingEvents = this.orderService.getMockTrackingEvents(updatedOrder);
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

  shareTrackingLink(): void {
    if (!this.order?.trackingNumber) return;

    const trackingUrl = `${window.location.origin}/orders/${this.order.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Order #${this.order.id} Tracking`,
        text: `Track my order #${this.order.id} with tracking number ${this.order.trackingNumber}`,
        url: trackingUrl
      }).catch(error => {
        console.error('Error sharing:', error);
        this.copyToClipboard(trackingUrl);
      });
    } else {
      this.copyToClipboard(trackingUrl);
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Tracking link copied to clipboard', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }).catch(error => {
      console.error('Error copying to clipboard:', error);
      this.snackBar.open('Error copying tracking link', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
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

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
} 