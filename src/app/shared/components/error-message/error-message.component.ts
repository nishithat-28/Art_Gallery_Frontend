import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-message">
      <mat-icon color="warn">error_outline</mat-icon>
      <p>{{ message }}</p>
      <button *ngIf="retryButton" 
              mat-raised-button 
              color="primary" 
              (click)="retry.emit()">
        {{ retryButtonText }}
      </button>
    </div>
  `,
  styles: [`
    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem;
      background: #fff3f3;
      border-radius: 8px;
      margin: 1rem 0;
    }

    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }

    p {
      color: #d32f2f;
      margin-bottom: 1rem;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message = 'An error occurred';
  @Input() retryButton = true;
  @Input() retryButtonText = 'Try Again';
  @Output() retry = new EventEmitter<void>();
} 