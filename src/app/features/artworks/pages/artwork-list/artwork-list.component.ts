import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../../../core/services/artwork.service';
import { CartService } from '../../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Artwork } from '../../../../core/models/artwork.model';

@Component({
  selector: 'app-artwork-list',
  template: `
    <div class="artwork-list-container">
      <div class="filters">
        <mat-form-field>
          <mat-label>Category</mat-label>
          <mat-select [(value)]="selectedCategory" (selectionChange)="filterArtworks()">
            <mat-option value="">All Categories</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category">
              {{category}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="artwork-grid">
        <app-artwork-card
          *ngFor="let artwork of filteredArtworks"
          [artwork]="artwork"
          (addToCart)="addToCart($event)">
        </app-artwork-card>
      </div>
    </div>
  `,
  styles: [`
    .artwork-list-container {
      padding: 2rem;
    }

    .filters {
      margin-bottom: 2rem;
    }

    .artwork-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
  `]
})
export class ArtworkListComponent implements OnInit {
  artworks: Artwork[] = [];
  filteredArtworks: Artwork[] = [];
  categories: string[] = [];
  selectedCategory: string = '';

  constructor(
    private artworkService: ArtworkService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.artworkService.getArtworks().subscribe({
      next: (artworks) => {
        this.artworks = artworks;
        this.filteredArtworks = artworks;
        this.categories = [...new Set(artworks.map(artwork => artwork.category))];
      },
      error: (error) => {
        console.error('Error loading artworks:', error);
        this.snackBar.open('Error loading artworks', 'Close', { duration: 3000 });
      }
    });
  }

  filterArtworks(): void {
    if (!this.selectedCategory) {
      this.filteredArtworks = this.artworks;
    } else {
      this.filteredArtworks = this.artworks.filter(
        artwork => artwork.category === this.selectedCategory
      );
    }
  }

  addToCart(artwork: Artwork): void {
    this.cartService.addToCart(artwork);
    this.snackBar.open(`${artwork.title} added to cart`, 'Close', { duration: 3000 });
  }
} 