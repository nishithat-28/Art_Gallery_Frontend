import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Artwork, ArtworkFilters } from '../models/artwork.model';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private apiUrl = `${environment.apiUrl}/artwork`;

  constructor(private http: HttpClient) {}

  getArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(this.apiUrl);
  }

  getArtwork(id: number): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.apiUrl}/${id}`);
  }

  getArtworksByCategory(category: string): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/category/${category}`);
  }

  searchArtworks(query: string): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/search?q=${query}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/artworks/categories`);
  }

  createArtwork(artwork: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>): Observable<Artwork> {
    return this.http.post<Artwork>(this.apiUrl, artwork);
  }

  updateArtwork(id: number, artwork: Partial<Artwork>): Observable<Artwork> {
    return this.http.patch<Artwork>(`${this.apiUrl}/${id}`, artwork);
  }

  deleteArtwork(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFeaturedArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/featured`);
  }

  // Mock data for development
  getMockArtworks(): Artwork[] {
    return [
      {
        id: 1,
        title: 'Abstract Harmony',
        description: 'A vibrant abstract painting exploring color and form.',
        price: 1200,
        imageUrl: 'assets/images/artwork1.jpg',
        artist: 'Jane Smith',
        category: 'Abstract',
        categoryId: 1,
        artistId: 1,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Mountain Sunset',
        description: 'A serene landscape capturing the beauty of nature.',
        price: 800,
        imageUrl: 'assets/images/artwork2.jpg',
        artist: 'John Doe',
        category: 'Landscape',
        categoryId: 2,
        artistId: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
} 