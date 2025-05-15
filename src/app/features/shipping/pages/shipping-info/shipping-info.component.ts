import { Component } from '@angular/core';

@Component({
  selector: 'app-shipping-info',
  template: `
    <div class="shipping-container">
      <h1>Shipping Information</h1>
      
      <mat-card>
        <mat-card-content>
          <h2>Shipping Methods</h2>
          <div class="shipping-method">
            <h3>Standard Shipping</h3>
            <p>Delivery within 5-7 business days</p>
            <p class="price">$15.00</p>
          </div>

          <div class="shipping-method">
            <h3>Express Shipping</h3>
            <p>Delivery within 2-3 business days</p>
            <p class="price">$25.00</p>
          </div>

          <div class="shipping-method">
            <h3>Overnight Shipping</h3>
            <p>Delivery within 1 business day</p>
            <p class="price">$35.00</p>
          </div>

          <h2>International Shipping</h2>
          <p>We ship to most countries worldwide. International shipping rates and delivery times vary by location. 
             You can view specific rates during checkout.</p>

          <h2>Artwork Packaging</h2>
          <p>All artworks are carefully packaged using professional-grade materials to ensure safe delivery:</p>
          <ul>
            <li>Paintings are wrapped in acid-free paper</li>
            <li>Multiple layers of bubble wrap for protection</li>
            <li>Custom-sized boxes with additional padding</li>
            <li>Fragile stickers and handling instructions</li>
          </ul>

          <h2>Tracking Information</h2>
          <p>Once your order ships, you'll receive a tracking number via email. You can also track your order 
             through your account dashboard.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .shipping-container {
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
      margin: 2rem 0 1rem;
    }

    h3 {
      color: #444;
      margin: 0 0 0.5rem;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .shipping-method {
      background: #f5f5f5;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }

    .price {
      font-weight: 500;
      color: #333;
      margin-top: 0.5rem;
    }

    ul {
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
export class ShippingInfoComponent {} 