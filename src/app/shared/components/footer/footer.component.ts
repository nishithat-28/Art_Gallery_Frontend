import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">About Us</h3>
            <p class="text-gray-300">
              Discover and collect unique artworks from talented artists around the world.
            </p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/artworks" class="text-gray-300 hover:text-white">Browse Art</a></li>
              <li><a routerLink="/auth/register" class="text-gray-300 hover:text-white">Join as Artist</a></li>
              <li><a routerLink="/about" class="text-gray-300 hover:text-white">About Us</a></li>
              <li><a routerLink="/contact" class="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-300">
              <li>Email: info@artgallery.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Art Street, Gallery City</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {{currentYear}} Art Gallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 