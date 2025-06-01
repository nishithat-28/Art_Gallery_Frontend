import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtworkService } from 'src/app/core/services/artwork.service';

@Component({
  selector: 'app-sell-artwork',
  templateUrl: './sell-artwork.component.html',
  styleUrls: ['./sell-artwork.component.scss']
})
export class SellArtworkComponent {
  artworkForm: FormGroup;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private artworkService: ArtworkService
  ) {
    this.artworkForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      year: ['', Validators.required],
      medium: ['', Validators.required],
      dimensions: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  onFileChange(event: any): void {
    this.imageFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.artworkForm.invalid || !this.imageFile) return;

    const formData = new FormData();
    Object.entries(this.artworkForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('imageFile', this.imageFile);

    this.artworkService.createArtwork(formData).subscribe({
      next: () => {
        alert('Artwork submitted successfully!');
        this.artworkForm.reset();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to submit artwork.');
      }
    });
  }
}
