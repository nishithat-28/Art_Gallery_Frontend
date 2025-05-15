import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtworkService, Artwork } from '../../../../core/services/artwork.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-artwork-detail',
  template: `
    <div class="container mx-auto px-4 py-8">
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && artwork" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <!-- Image Section -->
          <div class="relative">
            <img [src]="artwork?.imageUrl" [alt]="artwork?.title" class="w-full h-auto rounded-lg">
          </div>

          <!-- Details Section -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{artwork?.title}}</h1>
              <p class="text-lg text-gray-600">by {{artwork?.artistName}}</p>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <p class="text-gray-700">{{artwork?.description}}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Category</p>
                <p class="font-medium">{{artwork?.category}}</p>
              </div>
              <div>
                <p class="text-gray-500">Medium</p>
                <p class="font-medium">{{artwork?.medium}}</p>
              </div>
              <div>
                <p class="text-gray-500">Dimensions</p>
                <p class="font-medium">{{artwork?.dimensions}}</p>
              </div>
              <div>
                <p class="text-gray-500">Created</p>
                <p class="font-medium">{{artwork?.createdAt | date}}</p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{artwork?.price | currency}}</p>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center border rounded-md">
                    <button
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      (click)="updateQuantity(-1)"
                      [disabled]="quantity <= 1"
                    >
                      -
                    </button>
                    <span class="px-3 py-1">{{quantity}}</span>
                    <button
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      (click)="updateQuantity(1)"
                    >
                      +
                    </button>
                  </div>
                  <button
                    class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    (click)="addToCart()"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !artwork" class="text-center py-8">
        <p class="text-gray-500 text-lg">Artwork not found.</p>
      </div>
    </div>
  `,
  styles: []
})
export class ArtworkDetailComponent implements OnInit {
  artwork: Artwork | null = null;
  loading = false;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadArtwork();
  }

  private loadArtwork(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.artworkService.getArtworkById(id).subscribe({
      next: (artwork: Artwork) => {
        this.artwork = artwork;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artwork:', error);
        this.loading = false;
      }
    });
  }

  updateQuantity(change: number): void {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1) {
      this.quantity = newQuantity;
    }
  }

  addToCart(): void {
    if (this.artwork) {
      this.cartService.addToCart(this.artwork, this.quantity);
      this.snackBar.open('Added to cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.quantity = 1;
    }
  }
} 