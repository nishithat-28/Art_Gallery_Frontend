import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
  preferences?: {
    artworkUpdates: boolean;
    exclusiveOffers: boolean;
    artistSpotlights: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}/Newsletter`;

  constructor(private http: HttpClient) {}

  subscribe(email: string, preferences?: NewsletterSubscription['preferences']): Observable<NewsletterSubscription> {
    return this.http.post<NewsletterSubscription>(`${this.apiUrl}/subscribe`, {
      email,
      preferences: preferences || {
        artworkUpdates: true,
        exclusiveOffers: true,
        artistSpotlights: true
      }
    });
  }

  unsubscribe(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/unsubscribe`, { email });
  }

  updatePreferences(email: string, preferences: NewsletterSubscription['preferences']): Observable<NewsletterSubscription> {
    return this.http.put<NewsletterSubscription>(`${this.apiUrl}/preferences`, {
      email,
      preferences
    });
  }

  getSubscriptionStatus(email: string): Observable<NewsletterSubscription> {
    return this.http.get<NewsletterSubscription>(`${this.apiUrl}/status/${email}`);
  }
} 