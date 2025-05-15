import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArtworkService, Artwork } from '../../../../core/services/artwork.service';

@Component({
  selector: 'app-artwork-list',
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Artworks</h1>
        <div class="flex space-x-4">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            [(ngModel)]="selectedCategory"
            (ngModelChange)="filterByCategory()"
          >
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">
              {{category}}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let artwork of filteredArtworks" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="artwork.imageUrl" [alt]="artwork.title" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold text-gray-900">{{artwork.title}}</h2>
            <p class="text-sm text-gray-500 mt-1">{{artwork.category}}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">{{artwork.price | currency}}</span>
              <button
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                [routerLink]="['/artworks', artwork.id]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredArtworks.length === 0" class="text-center py-8">
        <p class="text-gray-500 text-lg">No artworks found.</p>
      </div>
    </div>
  `,
  styles: []
})
export class ArtworkListComponent implements OnInit {
  artworks: Artwork[] = [];
  filteredArtworks: Artwork[] = [];
  categories: string[] = [];
  selectedCategory: string = '';

  constructor(
    private artworkService: ArtworkService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArtworks();
    this.loadCategories();
  }

  private loadArtworks(): void {
    this.artworkService.getArtworks().subscribe({
      next: (artworks) => {
        this.artworks = artworks;
        this.filteredArtworks = artworks;
      },
      error: (error) => {
        console.error('Error loading artworks:', error);
      }
    });
  }

  private loadCategories(): void {
    this.artworkService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.filteredArtworks = this.artworks;
    } else {
      this.filteredArtworks = this.artworks.filter(
        artwork => artwork.category === this.selectedCategory
      );
    }
  }
} 