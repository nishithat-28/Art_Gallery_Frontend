import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../../../core/services/artwork.service';
import { CategoryService } from '../../../../core/services/category.service';
import { CartService } from '../../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Artwork } from '../../../../core/models/artwork.model';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-artwork-list',
  template: `
    <div class="artwork-list-container">
      <div class="filters">
       <mat-form-field>
          <mat-label>Category</mat-label>
          <mat-select [(value)]="selectedCategoryId" (selectionChange)="filterArtworks()">
            <mat-option [value]="null">All Categories</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
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
  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadArtworks();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('Loaded categories:', categories); // Debug log
        this.categories = categories;
        if (categories.length === 0) {
          console.warn('No categories loaded from the backend');
          this.snackBar.open('No categories available', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
      }
    });
  }

  loadArtworks(): void {
    if (this.selectedCategoryId) {
      this.artworkService.getArtworksByCategory(this.selectedCategoryId).subscribe({
        next: (artworks) => {
          this.artworks = artworks;
          this.filteredArtworks = artworks;
        },
        error: (error) => {
          console.error('Error loading artworks by category:', error);
          this.snackBar.open('Error loading artworks', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.artworkService.getArtworks().subscribe({
        next: (artworks) => {
          this.artworks = artworks;
          this.filteredArtworks = artworks;
        },
        error: (error) => {
          console.error('Error loading artworks:', error);
          this.snackBar.open('Error loading artworks', 'Close', { duration: 3000 });
        }
      });
    }
  }

  filterArtworks(): void {
    this.loadArtworks(); // Reload artworks when category changes
  }

  addToCart(artwork: Artwork): void {
    this.cartService.addToCart(artwork);
    this.snackBar.open(`${artwork.title} added to cart`, 'Close', { duration: 3000 });
  }
} 