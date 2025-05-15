import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Artwork } from '../../../core/models/artwork.model';

@Component({
  selector: 'app-artwork-card',
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <img [src]="artwork.imageUrl" [alt]="artwork.title" class="w-full h-48 object-cover">
      
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ artwork.title }}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ artwork.description }}</p>
        
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-gray-900">{{ artwork.price | currency }}</span>
          <button 
            (click)="viewDetails()"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ArtworkCardComponent {
  @Input() artwork!: Artwork;

  constructor(private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/artworks', this.artwork.id]);
  }
} 