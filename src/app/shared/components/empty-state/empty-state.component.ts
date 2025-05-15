import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button *ngIf="buttonText" 
              mat-raised-button 
              color="primary" 
              [routerLink]="buttonLink">
        {{ buttonText }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 3rem;
      background: #f5f5f5;
      border-radius: 8px;
      margin: 1rem 0;
    }

    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #666;
      margin-bottom: 1rem;
    }

    h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'info';
  @Input() title = 'No Data';
  @Input() message = 'No items to display';
  @Input() buttonText?: string;
  @Input() buttonLink?: string;
} 