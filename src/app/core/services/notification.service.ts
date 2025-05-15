import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationPreferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  deliveryUpdates: boolean;
  marketingEmails: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotificationPreferences(): Observable<NotificationPreferences> {
    return this.http.get<NotificationPreferences>(`${this.apiUrl}/preferences`);
  }

  updateNotificationPreferences(preferences: NotificationPreferences): Observable<NotificationPreferences> {
    return this.http.put<NotificationPreferences>(`${this.apiUrl}/preferences`, preferences);
  }

  subscribeToOrderUpdates(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/orders/${orderId}/subscribe`, {});
  }

  unsubscribeFromOrderUpdates(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/orders/${orderId}/unsubscribe`, {});
  }

  // Mock method for development
  getMockNotificationPreferences(): NotificationPreferences {
    return {
      emailNotifications: true,
      orderUpdates: true,
      deliveryUpdates: true,
      marketingEmails: false
    };
  }
} 