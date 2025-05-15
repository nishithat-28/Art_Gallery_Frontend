import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  template: `
    <div class="faq-container">
      <h1>Frequently Asked Questions</h1>
      
      <mat-accordion>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              How do I track my order?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>You can track your order by logging into your account and visiting the order details page. 
             You'll find the tracking information there once your order has been shipped.</p>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              What is your return policy?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>We accept returns within 30 days of delivery. The artwork must be in its original condition 
             and packaging. Please visit our Returns Policy page for more details.</p>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              How is my artwork packaged?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>All artworks are carefully packaged using professional-grade materials to ensure safe delivery. 
             Paintings are wrapped in acid-free paper and bubble wrap, then placed in custom-sized boxes 
             with additional padding.</p>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              Do you ship internationally?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. 
             You can view shipping options during checkout.</p>
        </mat-expansion-panel>

        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              How can I contact customer support?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>You can reach our customer support team through the Contact Us page, or by emailing 
             support@artgallery.com. We typically respond within 24 hours.</p>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    mat-accordion {
      display: block;
      margin-bottom: 2rem;
    }

    mat-expansion-panel {
      margin-bottom: 1rem;
    }

    mat-panel-title {
      font-weight: 500;
      color: #333;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }
  `]
})
export class FaqPageComponent {} 