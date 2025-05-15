import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  template: `
    <div class="about-container">
      <h1>About Our Art Gallery</h1>
      <div class="about-content">
        <p>Welcome to our online art gallery, where we showcase exceptional artwork from talented artists around the world.</p>
        <p>Our mission is to make art accessible to everyone and support emerging artists in their creative journey.</p>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .about-content {
      line-height: 1.6;
      color: #666;
    }

    p {
      margin-bottom: 1rem;
    }
  `]
})
export class AboutPageComponent {} 