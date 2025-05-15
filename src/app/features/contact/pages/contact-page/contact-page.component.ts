import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-page',
  template: `
    <div class="contact-container">
      <h1>Contact Us</h1>
      
      <div class="contact-info">
        <div class="info-item">
          <mat-icon>email</mat-icon>
          <p>Email: info@artgallery.com</p>
        </div>
        <div class="info-item">
          <mat-icon>phone</mat-icon>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div class="info-item">
          <mat-icon>location_on</mat-icon>
          <p>Address: 123 Art Street, Gallery City</p>
        </div>
      </div>

      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="contactForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
          <mat-error *ngIf="contactForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="contactForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Subject</mat-label>
          <input matInput formControlName="subject" required>
          <mat-error *ngIf="contactForm.get('subject')?.hasError('required')">
            Subject is required
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Message</mat-label>
          <textarea matInput formControlName="message" required rows="5"></textarea>
          <mat-error *ngIf="contactForm.get('message')?.hasError('required')">
            Message is required
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="contactForm.invalid">
          Send Message
        </button>
      </form>
    </div>
  `,
  styles: [`
    .contact-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;

      mat-icon {
        color: #666;
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      mat-form-field {
        width: 100%;
      }

      button {
        align-self: flex-end;
      }
    }
  `]
})
export class ContactPageComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // TODO: Implement contact form submission
      this.snackBar.open('Message sent successfully', 'Close', { duration: 3000 });
      this.contactForm.reset();
    }
  }
} 