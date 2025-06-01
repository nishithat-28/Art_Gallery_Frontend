import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../../../core/services/artwork.service';
import { Artwork } from 'src/app/core/models/artwork.model';
import { CartService } from '../../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-artwork-details',
  template: `
    <div class="container mx-auto px-4 py-8">
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && artwork" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <!-- Image Section -->
          <div class="relative">
            <img [src]="imageUrl" [alt]="artwork.title" class="w-full h-auto rounded-lg">
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
      </div>
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
export class ArtworkDetailsComponent implements OnInit, OnDestroy {
  artwork: Artwork | null = null;
  loading: boolean = false;
  imageUrl: SafeUrl = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadArtwork();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadArtwork(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      const artworkId = Number(id);
      
      // Load artwork details
      const artworkSub = this.artworkService.getArtwork(artworkId).subscribe({
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
      this.subscriptions.push(artworkSub);

      // Load artwork image
      const imageSub = this.artworkService.getArtworkImage(artworkId).subscribe({
        next: (blob) => {
          const objectUrl = URL.createObjectURL(blob);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        },
        error: (error) => {
          console.error('Error loading artwork image:', error);
          this.snackBar.open('Failed to load artwork image', 'Close', { duration: 3000 });
        }
      });
      this.subscriptions.push(imageSub);
    }
  }

  addToCart(): void {
    if (this.artwork) {
      const sub = this.cartService.addToCart(this.artwork).subscribe({
        next: () => {
          this.snackBar.open('Added to cart', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.snackBar.open('Failed to add to cart', 'Close', { duration: 3000 });
        }
      });
      this.subscriptions.push(sub);
    }
  }
} 