import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewsletterService } from '../../services/newsletter.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-gray-900 text-white">
      <!-- Main Footer -->
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About Section -->
          <div>
            <h3 class="text-xl font-semibold mb-4">About ArtGallery</h3>
            <p class="text-gray-400 mb-4">
              Discover unique artwork from talented artists around the world. We bring art lovers and creators together.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="material-icons">facebook</i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="material-icons">twitter</i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="material-icons">instagram</i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="material-icons">pinterest</i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/about" class="text-gray-400 hover:text-white">About Us</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a routerLink="/faq" class="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a routerLink="/shipping" class="text-gray-400 hover:text-white">Shipping Info</a></li>
              <li><a routerLink="/returns" class="text-gray-400 hover:text-white">Returns Policy</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Categories</h3>
            <ul class="space-y-2">
              <li><a routerLink="/artworks/paintings" class="text-gray-400 hover:text-white">Paintings</a></li>
              <li><a routerLink="/artworks/sculptures" class="text-gray-400 hover:text-white">Sculptures</a></li>
              <li><a routerLink="/artworks/photography" class="text-gray-400 hover:text-white">Photography</a></li>
              <li><a routerLink="/artworks/digital" class="text-gray-400 hover:text-white">Digital Art</a></li>
              <li><a routerLink="/artworks/prints" class="text-gray-400 hover:text-white">Prints</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Newsletter</h3>
            <p class="text-gray-400 mb-4">
              Subscribe to our newsletter for updates on new artwork and exclusive offers.
            </p>
            <form [formGroup]="newsletterForm" (ngSubmit)="onSubscribe()" class="space-y-2">
              <input
                type="email"
                formControlName="email"
                placeholder="Enter your email"
                class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                [class.border-red-500]="newsletterForm.get('email')?.invalid && newsletterForm.get('email')?.touched"
              >
              <div *ngIf="newsletterForm.get('email')?.invalid && newsletterForm.get('email')?.touched" class="text-red-500 text-sm">
                Please enter a valid email address
              </div>
              <button
                type="submit"
                [disabled]="newsletterForm.invalid || isSubscribing"
                class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">
              © 2024 ArtGallery. All rights reserved.
            </p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  newsletterForm: FormGroup;
  isSubscribing = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private newsletterService: NewsletterService
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubscribe(): void {
    if (this.newsletterForm.valid) {
      this.isSubscribing = true;
      const email = this.newsletterForm.get('email')?.value;

      this.newsletterService.subscribe(email)
        .pipe(
          finalize(() => {
            this.isSubscribing = false;
            this.newsletterForm.reset();
          })
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Thank you for subscribing to our newsletter!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Newsletter subscription error:', error);
            this.snackBar.open(
              'Sorry, there was an error subscribing to the newsletter. Please try again later.',
              'Close',
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              }
            );
          }
        });
    }
  }
} 