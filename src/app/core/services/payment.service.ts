import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  name: string;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  clientSecret: string;
}

export interface AddPaymentMethodRequest {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/methods`);
  }

  addPaymentMethod(paymentMethod: AddPaymentMethodRequest): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.apiUrl}/methods`, paymentMethod);
  }

  deletePaymentMethod(methodId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/methods/${methodId}`);
  }

  setDefaultPaymentMethod(methodId: string): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.apiUrl}/methods/${methodId}/default`, {});
  }

  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.apiUrl}/intents`, { amount });
  }

  confirmPayment(intentId: string, paymentMethodId: string): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.apiUrl}/intents/${intentId}/confirm`, {
      paymentMethodId
    });
  }
} 