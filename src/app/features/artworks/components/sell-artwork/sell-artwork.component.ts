import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private artworkService: ArtworkService,
    private snackBar: MatSnackBar
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
        this.snackBar.open('Artwork submitted successfully.', 'Close', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
        });
        this.artworkForm.reset();
      },
      error: (err) => {
        console.error('Error:', err);
        this.snackBar.open('Failed to submit artwork.', 'Close', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
        });
      }
    });
  }
}
