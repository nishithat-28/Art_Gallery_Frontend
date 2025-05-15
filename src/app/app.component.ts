import { Component } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header></app-header>
      
      <main class="flex-grow">
        <app-loading-spinner></app-loading-spinner>
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  title = 'Online Art Gallery';
} 