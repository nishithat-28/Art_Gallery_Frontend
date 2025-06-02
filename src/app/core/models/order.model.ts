import { Artwork } from './artwork.model';

export interface OrderResponseDto {
  id: number;
  userId: number;
  username: string;
  orderDate: Date;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  paymentMethod: string;
  invoiceNumber: string;
  orderItems: OrderItemResponseDto[];
}

export interface OrderItemResponseDto {
  id: number;
  artWorkId: number;
  artWorkTitle: string;
  artWorkArtist: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderCreateDto {
  userId: number;
  shippingAddress: string;
  paymentMethod: string;
  orderItems: OrderItemDto[];
}

export interface OrderItemDto {
  artWorkId: number;
  quantity: number;
}

export interface InvoiceDto {
  invoiceNumber: string;
  invoiceDate: Date;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItemResponseDto[];
  subtotal: number;
  tax: number;
  total: number;
}

// For backward compatibility and type safety
export type Order = OrderResponseDto;
export type OrderItem = OrderItemResponseDto;

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