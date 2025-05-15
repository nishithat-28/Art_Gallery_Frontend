import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-spinner" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-spinner.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 1000;
    }

    p {
      margin-top: 1rem;
      color: #666;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() message?: string;
  @Input() overlay = false;
} 