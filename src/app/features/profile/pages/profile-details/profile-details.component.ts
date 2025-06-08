import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile-details',
  template: `
    <div class="profile-container" *ngIf="currentUser; else noUser">
      <img src="assets/images/profile-logo.png" alt="Profile Logo" class="profile-img">
      
      <h1>Personal Details</h1>
      <hr><br>
      <div class="profile-info">
        <p><strong>Username: </strong> {{ currentUser.username || '-' }}</p>
        <p><strong>First Name: </strong> {{ currentUser.firstName || '-' }}</p>
        <p><strong>Last Name: </strong> {{ currentUser.lastName || '-' }}</p>
        <p><strong>Email: </strong> {{ currentUser.email || '-' }}</p>
      </div>
      <br>
      <button (click)="logout()" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
    </div>

    <ng-template #noUser>
      <div class="no-user">
        <p>User not found or not logged in.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .profile-img {
      height: 150px;
      width: 150px;
      display: block;
      margin: 0 auto 1.5rem auto;
      border-radius: 50%;
      object-fit: cover;
    }
    .profile-container {
      max-width: 500px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: #f9fafb;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      font-family: 'Segoe UI', sans-serif;
    }

    h1 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #1f2937;
    }

    .profile-info p {
      font-size: 16px;
      margin: 0.5rem 0;
      color: #374151;
    }

    .profile-info strong {
      color: #111827;
    }

    .no-user {
      text-align: center;
      margin-top: 3rem;
      color: #9ca3af;
      font-style: italic;
    }
  `]
})

export class ProfileDetailsComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  logout() {
    this.authService.logout();
  }
}
