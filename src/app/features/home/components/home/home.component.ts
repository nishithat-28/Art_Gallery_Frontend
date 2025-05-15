import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 py-16">
        <div class="hero-content max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div class="flex flex-col px-4 md:px-8">
            <h1 class="hero-title mb-8">
              Discover Unique Artworks from Talented Artists
            </h1>
            <p class="text-xl mb-12 text-gray-100 min-h-[96px]">
              Explore our curated collection of original paintings, sculptures, and digital art from emerging and established artists worldwide.
            </p>
            <div class="mt-auto">
              <button 
                routerLink="/artworks"
                class="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Browse Gallery
              </button>
            </div>
          </div>
          <div class="flex flex-col px-4 md:px-8">
            <h1 class="hero-title mb-8">
              Join our Community
            </h1>
            <p class="text-xl mb-12 text-gray-100 min-h-[96px]">
              Connect with artists and art enthusiasts. Share your passion for art and discover unique pieces.
            </p>
            <div class="mt-auto">
              <button 
                routerLink="/auth/register"
                class="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Categories</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="category-card">
          <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80" alt="Paintings">
          <div class="category-overlay"></div>
          <div class="category-content">
            <h3 class="text-xl font-semibold text-white mb-2">Paintings</h3>
            <p class="text-gray-200">Original oil, acrylic, and watercolor artworks</p>
          </div>
        </div>
        <div class="category-card">
          <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80" alt="Sculptures">
          <div class="category-overlay"></div>
          <div class="category-content">
            <h3 class="text-xl font-semibold text-white mb-2">Sculptures</h3>
            <p class="text-gray-200">Unique three-dimensional art pieces</p>
          </div>
        </div>
        <div class="category-card">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" alt="Digital Art">
          <div class="category-overlay"></div>
          <div class="category-content">
            <h3 class="text-xl font-semibold text-white mb-2">Digital Art</h3>
            <p class="text-gray-200">Contemporary digital creations</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Our Gallery</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="feature-card">
          <div class="feature-icon">
            <mat-icon>verified</mat-icon>
          </div>
          <h3 class="feature-title">Authentic Artworks</h3>
          <p class="feature-description">Every piece is verified and comes with a certificate of authenticity</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <mat-icon>local_shipping</mat-icon>
          </div>
          <h3 class="feature-title">Secure Shipping</h3>
          <p class="feature-description">Professional packaging and worldwide delivery with tracking</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <mat-icon>support_agent</mat-icon>
          </div>
          <h3 class="feature-title">Expert Support</h3>
          <p class="feature-description">Dedicated team to assist you with any questions</p>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section py-16">
      <div class="container mx-auto px-4">
        <div class="newsletter-content text-center">
          <h2 class="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p class="text-xl mb-8 text-purple-100">Subscribe to our newsletter for new artworks and exclusive offers</p>
          <form class="newsletter-form flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="flex-1 px-6 py-3 rounded-lg"
            >
            <button 
              type="submit"
              class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {} 