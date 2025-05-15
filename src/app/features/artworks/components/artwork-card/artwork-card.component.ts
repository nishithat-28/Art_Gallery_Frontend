import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Artwork } from '../../../../core/models/artwork.model';

@Component({
  selector: 'app-artwork-card',
  templateUrl: './artwork-card.component.html',
  styleUrls: ['./artwork-card.component.scss']
})
export class ArtworkCardComponent {
  @Input() artwork!: Artwork;
  @Output() addToCart = new EventEmitter<Artwork>();

  constructor() {}

  onAddToCart(): void {
    this.addToCart.emit(this.artwork);
  }
} 