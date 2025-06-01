import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Artwork } from '../../../../core/models/artwork.model';
import { ArtworkService } from 'src/app/core/services/artwork.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-artwork-card',
  templateUrl: './artwork-card.component.html',
  styleUrls: ['./artwork-card.component.scss']
})
export class ArtworkCardComponent {
  @Input() artwork!: Artwork;
  @Output() addToCart = new EventEmitter<Artwork>();

  artworkImageUrl: SafeUrl = 'https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk='; // fallback image

  constructor(
    private sanitizer: DomSanitizer,
    private artworkService: ArtworkService) {}

  ngOnInit(): void {
    if (this.artwork?.id) {
      this.artworkService.getArtworkImage(this.artwork.id).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.artworkImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: () => {
          console.warn('Failed to load artwork image for ID:', this.artwork.id);
        }
      });
    }
  }

  onAddToCart(): void {
    this.addToCart.emit(this.artwork);
  }
} 