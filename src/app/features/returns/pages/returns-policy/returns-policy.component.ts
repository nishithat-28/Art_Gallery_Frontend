import { Component } from '@angular/core';

@Component({
  selector: 'app-returns-policy',
  template: `
    <div class="returns-container">
      <h1>Returns Policy</h1>
      
      <mat-card>
        <mat-card-content>
          <h2>30-Day Return Policy</h2>
          <p>We want you to be completely satisfied with your purchase. If for any reason you're not happy with your artwork, 
             you may return it within 30 days of delivery for a full refund.</p>

          <h3>Return Conditions</h3>
          <ul>
            <li>The artwork must be in its original condition</li>
            <li>All original packaging materials must be included</li>
            <li>The artwork must be properly packaged for return shipping</li>
            <li>Return shipping costs are the responsibility of the customer</li>
          </ul>

          <h3>How to Return</h3>
          <ol>
            <li>Contact our customer service team to initiate the return</li>
            <li>Package the artwork securely using the original packaging</li>
            <li>Include a copy of your order confirmation</li>
            <li>Ship the package to our returns address</li>
          </ol>

          <h3>Refund Process</h3>
          <p>Once we receive and inspect your return, we will process your refund within 5-7 business days. 
             The refund will be issued to your original payment method.</p>

          <h3>Exceptions</h3>
          <p>Custom or commissioned artwork may not be eligible for returns. Please contact us for specific details 
             regarding custom orders.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .returns-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    mat-card {
      margin-bottom: 2rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    h3 {
      color: #444;
      margin: 1.5rem 0 0.5rem;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    ul, ol {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class ReturnsPolicyComponent {} 