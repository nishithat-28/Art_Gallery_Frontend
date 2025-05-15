import { Artwork } from './artwork.model';

export interface Order {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  trackingHistory?: TrackingEvent[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  artworkId: number;
  quantity: number;
  price: number;
  artwork: Artwork;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: Date;
  description: string;
} 