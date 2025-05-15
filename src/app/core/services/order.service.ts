import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from './cart.service';
import { Order, OrderItem, TrackingEvent } from '../models/order.model';

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
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  createOrder(cartItems: CartItem[], shippingAddress: CreateOrderDto['shippingAddress']): Observable<Order> {
    const orderItems = this.mapCartItemsToOrderItems(cartItems);

    const orderData: CreateOrderDto = {
      items: orderItems,
      shippingAddress
    };

    return this.http.post<Order>(this.apiUrl, orderData);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
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
      timestamp: new Date(order.createdAt),
      description: 'Your order has been placed successfully'
    });

    // Processing
    const processingDate = new Date(order.createdAt);
    processingDate.setHours(processingDate.getHours() + 2);
    events.push({
      status: 'Processing',
      location: 'Warehouse',
      timestamp: processingDate,
      description: 'Your order is being processed'
    });

    // Shipped
    if (order.status === 'shipped' || order.status === 'delivered') {
      const shippedDate = new Date(processingDate);
      shippedDate.setDate(shippedDate.getDate() + 1);
      events.push({
        status: 'Shipped',
        location: 'Shipping Center',
        timestamp: shippedDate,
        description: `Your order has been shipped. Tracking number: ${order.trackingNumber || 'N/A'}`
      });

      // Delivered
      if (order.status === 'delivered') {
        const deliveredDate = new Date(shippedDate);
        deliveredDate.setDate(deliveredDate.getDate() + 2);
        events.push({
          status: 'Delivered',
          location: order.shippingAddress.city,
          timestamp: deliveredDate,
          description: 'Your order has been delivered'
        });
      }
    }

    // Cancelled
    if (order.status === 'cancelled') {
      const cancelledDate = new Date(order.createdAt);
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