import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from './cart.service';
import { 
  Order, 
  OrderCreateDto, 
  OrderItemDto, 
  OrderResponseDto, 
  InvoiceDto, 
  TrackingEvent
} from '../models/order.model';
import { AuthService } from './auth.service';

// Re-export types
export type { Order, TrackingEvent };

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface CreateOrderDto {
  items: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Order`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createOrder(shippingAddress: string, paymentMethod: string, cartItems: CartItem[]): Observable<OrderResponseDto> {
    console.log('Order Service - Starting order creation');
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        console.log('Order Service - Current user state:', user);
        
        if (!user?.id) {
          console.error('Order Service - User not authenticated:', {
            user,
            hasId: !!user?.id,
            token: this.authService.getToken()
          });
          throw new Error('User not authenticated');
        }

        const orderItems: OrderItemDto[] = cartItems.map(item => ({
          artWorkId: item.artwork.id,
          quantity: item.quantity
        }));

        const orderData: OrderCreateDto = {
          shippingAddress,
          paymentMethod,
          orderItems
        };

        console.log('Order Service - Sending order data:', orderData);
        return this.http.post<OrderResponseDto>(this.apiUrl, orderData);
      })
    );
  }

  getOrders(): Observable<OrderResponseDto[]> {
    return this.http.get<OrderResponseDto[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<OrderResponseDto> {
    return this.http.get<OrderResponseDto>(`${this.apiUrl}/${id}`);
  }

  getInvoice(id: number): Observable<InvoiceDto> {
    return this.http.get<InvoiceDto>(`${this.apiUrl}/invoice/${id}`);
  }

  // Helper method to format shipping address
  formatShippingAddress(address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }): string {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  }

  cancelOrder(id: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`);
  }

  getOrderTracking(id: string): Observable<TrackingEvent[]> {
    return this.http.get<TrackingEvent[]>(`${this.apiUrl}/${id}/tracking`);
  }

  // Mock tracking data for development
  getMockTrackingEvents(order: Order): TrackingEvent[] {
    const events: TrackingEvent[] = [];
    
    // Order created
    events.push({
      status: 'Order Placed',
      location: 'Online Store',
      timestamp: new Date(order.orderDate),
      description: 'Your order has been placed successfully'
    });

    // Processing
    const processingDate = new Date(order.orderDate);
    processingDate.setHours(processingDate.getHours() + 2);
    events.push({
      status: 'Processing',
      location: 'Warehouse',
      timestamp: processingDate,
      description: 'Your order is being processed'
    });

    // Shipped
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      const shippedDate = new Date(processingDate);
      shippedDate.setDate(shippedDate.getDate() + 1);
      events.push({
        status: 'Shipped',
        location: 'Shipping Center',
        timestamp: shippedDate,
        description: `Your order has been shipped.`
      });

      // Delivered
      if (order.status === 'Delivered') {
        const deliveredDate = new Date(shippedDate);
        deliveredDate.setDate(deliveredDate.getDate() + 2);
        events.push({
          status: 'Delivered',
          location: order.shippingAddress,
          timestamp: deliveredDate,
          description: 'Your order has been delivered'
        });
      }
    }

    // Cancelled
    if (order.status === 'Cancelled') {
      const cancelledDate = new Date(order.orderDate);
      cancelledDate.setHours(cancelledDate.getHours() + 1);
      events.push({
        status: 'Cancelled',
        location: 'Online Store',
        timestamp: cancelledDate,
        description: 'Your order has been cancelled'
      });
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private mapCartItemsToOrderItems(items: CartItem[]): CreateOrderDto['items'] {
    return items.map(item => ({
      id: item.artwork.id,
      title: item.artwork.title,
      price: item.artwork.price,
      quantity: item.quantity,
      imageUrl: item.artwork.imageUrl
    }));
  }
} 