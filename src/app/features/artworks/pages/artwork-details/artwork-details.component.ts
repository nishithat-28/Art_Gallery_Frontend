import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../../../core/services/artwork.service';
import { Artwork } from 'src/app/core/models/artwork.model';
import { CartService } from '../../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-artwork-details',
  template: `
    <div class="artwork-details-container" *ngIf="artwork">
      <div class="artwork-image">
        <img [src]="artwork.imageUrl" [alt]="artwork.title">
      </div>
      
      <div class="artwork-info">
        <h1>{{ artwork.title }}</h1>
        <p class="artist">By {{ artwork.artist }}</p>
        <p class="price">{{ artwork.price | currency }}</p>
        <p class="description">{{ artwork.description }}</p>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="addToCart()">
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading">
      <mat-spinner></mat-spinner>
    </div>

    <div *ngIf="!loading && !artwork" class="error">
      <p>Artwork not found.</p>
    </div>
  `,
  styles: [`
    .artwork-details-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .artwork-image {
      img {
        width: 100%;
        height: auto;
        border-radius: 8px;
      }
    }

    .artwork-info {
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }

      .artist {
        color: #666;
        margin-bottom: 1rem;
      }

      .price {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 1rem;
      }

      .description {
        color: #666;
        line-height: 1.6;
        margin-bottom: 2rem;
      }

      .actions {
        button {
          width: 100%;
        }
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .error {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .artwork-details-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ArtworkDetailsComponent implements OnInit {
  artwork: Artwork | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadArtwork();
  }

  loadArtwork(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.artworkService.getArtwork(Number(id)).subscribe({
        next: (artwork) => {
          this.artwork = artwork;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading artwork:', error);
          this.snackBar.open('Failed to load artwork details', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  addToCart(): void {
    if (this.artwork) {
      this.cartService.addToCart(this.artwork).subscribe({
        next: () => {
          this.snackBar.open('Added to cart', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.snackBar.open('Failed to add to cart', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 