import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Artwork } from '../models/artwork.model';

export interface CreateArtWorkDto {
  title: string;
  artist: string;
  description: string;
  price: number;
  year: number;
  medium: string;
  dimensions: string;
  categoryId: number;
  imageFile: File;
}

export interface UpdateArtWorkDto {
  id: number;
  title: string;
  artist: string;
  description: string;
  price: number;
  year: number;
  medium: string;
  dimensions: string;
  categoryId: number;
  isAvailable: boolean;
  imageFile?: File;
}

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private apiUrl = `${environment.apiUrl}/ArtWork`;

  constructor(private http: HttpClient) {}

  // GET: api/ArtWork
  getArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(this.apiUrl);
  }

  // GET: api/ArtWork/5
  getArtwork(id: number): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.apiUrl}/${id}`);
  }

  // GET: api/ArtWork/image/5
  getArtworkImage(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/image`, { responseType: 'blob' });
  }

  // GET: api/ArtWork/category/1
  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  // POST: api/ArtWork/batch
  getArtworksBatch(ids: number[]): Observable<Artwork[]> {
    return this.http.post<Artwork[]>(`${this.apiUrl}/batch`, ids);
  }

  // POST: api/ArtWork
  createArtwork(formData: FormData): Observable<Artwork> {
    return this.http.post<Artwork>(this.apiUrl, formData);
  }

  // PUT: api/ArtWork/5
  updateArtwork(id: number, artwork: UpdateArtWorkDto): Observable<void> {
    const formData = new FormData();
    formData.append('id', artwork.id.toString());
    formData.append('title', artwork.title);
    formData.append('artist', artwork.artist);
    formData.append('description', artwork.description);
    formData.append('price', artwork.price.toString());
    formData.append('year', artwork.year.toString());
    formData.append('medium', artwork.medium);
    formData.append('dimensions', artwork.dimensions);
    formData.append('categoryId', artwork.categoryId.toString());
    formData.append('isAvailable', artwork.isAvailable.toString());
    if (artwork.imageFile) {
      formData.append('imageFile', artwork.imageFile);
    }

    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  // DELETE: api/ArtWork/5
  deleteArtwork(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // POST: api/ArtWork/process-database-images
  processDatabaseImages(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process-database-images`, {});
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