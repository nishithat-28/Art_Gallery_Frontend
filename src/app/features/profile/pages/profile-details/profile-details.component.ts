import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-details',
  template: `
    <div class="profile-container">
      <h1>My Profile</h1>
      
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
        <div class="form-section">
          <h2>Personal Information</h2>
          
          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required>
            <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" required>
            <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required type="email">
            <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" required>
            <mat-error *ngIf="profileForm.get('phone')?.hasError('required')">
              Phone number is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-section">
          <h2>Address</h2>
          
          <mat-form-field>
            <mat-label>Street Address</mat-label>
            <input matInput formControlName="street" required>
            <mat-error *ngIf="profileForm.get('street')?.hasError('required')">
              Street address is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>City</mat-label>
            <input matInput formControlName="city" required>
            <mat-error *ngIf="profileForm.get('city')?.hasError('required')">
              City is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>State</mat-label>
            <input matInput formControlName="state" required>
            <mat-error *ngIf="profileForm.get('state')?.hasError('required')">
              State is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>ZIP Code</mat-label>
            <input matInput formControlName="zipCode" required>
            <mat-error *ngIf="profileForm.get('zipCode')?.hasError('required')">
              ZIP code is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;

      h2 {
        color: #333;
        margin-bottom: 1.5rem;
      }
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
  `]
})
export class ProfileDetailsComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // TODO: Load user profile data
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // TODO: Save profile data
      this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
    }
  }
} 