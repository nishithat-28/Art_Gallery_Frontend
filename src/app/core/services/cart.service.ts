import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Artwork } from '../models/artwork.model';

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface SavedItem {
  artwork: Artwork;
  savedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart';
  private readonly SAVED_KEY = 'saved_items';
  private readonly TAX_RATE = 0.08; // 8% tax rate

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private savedItems = new BehaviorSubject<SavedItem[]>([]);

  constructor() {
    this.loadCart();
    this.loadSavedItems();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.CART_KEY);
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  private loadSavedItems(): void {
    const savedItems = localStorage.getItem(this.SAVED_KEY);
    if (savedItems) {
      this.savedItems.next(JSON.parse(savedItems));
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems.value));
  }

  private saveSavedItems(): void {
    localStorage.setItem(this.SAVED_KEY, JSON.stringify(this.savedItems.value));
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getSavedItems(): Observable<SavedItem[]> {
    return this.savedItems.asObservable();
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.artwork.price * item.quantity);
    }, 0);
  }

  getTaxAmount(): number {
    return this.getCartTotal() * this.TAX_RATE;
  }

  getGrandTotal(): number {
    return this.getCartTotal() + this.getTaxAmount();
  }

  addToCart(artwork: Artwork): Observable<void> {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.artwork.id === artwork.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { artwork, quantity: 1 }]);
    }

    this.saveCart();
    return of(void 0);
  }

  updateQuantity(artworkId: number, quantity: number): Observable<void> {
    if (quantity < 1) {
      return of(void 0);
    }

    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(item => item.artwork.id === artworkId);

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.saveCart();
    }

    return of(void 0);
  }

  removeFromCart(artworkId: number): Observable<void> {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.artwork.id !== artworkId);
    this.cartItems.next(updatedItems);
    this.saveCart();
    return of(void 0);
  }

  clearCart(): Observable<void> {
    this.cartItems.next([]);
    this.saveCart();
    return of(void 0);
  }

  saveForLater(artworkId: number): Observable<void> {
    const currentItems = this.cartItems.value;
    const itemToSave = currentItems.find(item => item.artwork.id === artworkId);

    if (itemToSave) {
      const currentSavedItems = this.savedItems.value;
      const alreadySaved = currentSavedItems.some(item => item.artwork.id === artworkId);

      if (!alreadySaved) {
        this.savedItems.next([...currentSavedItems, { artwork: itemToSave.artwork, savedAt: new Date() }]);
        this.saveSavedItems();
      }

      // Remove from cart
      const updatedItems = currentItems.filter(item => item.artwork.id !== artworkId);
      this.cartItems.next(updatedItems);
      this.saveCart();
    }

    return of(void 0);
  }

  moveToCart(artworkId: number): Observable<void> {
    const currentSavedItems = this.savedItems.value;
    const itemToMove = currentSavedItems.find(item => item.artwork.id === artworkId);

    if (itemToMove) {
      // Add to cart
      const currentItems = this.cartItems.value;
      const existingItem = currentItems.find(item => item.artwork.id === artworkId);

      if (existingItem) {
        existingItem.quantity += 1;
        this.cartItems.next([...currentItems]);
      } else {
        this.cartItems.next([...currentItems, { artwork: itemToMove.artwork, quantity: 1 }]);
      }
      this.saveCart();

      // Remove from saved items
      const updatedSavedItems = currentSavedItems.filter(item => item.artwork.id !== artworkId);
      this.savedItems.next(updatedSavedItems);
      this.saveSavedItems();
    }

    return of(void 0);
  }

  removeFromSaved(artworkId: number): Observable<void> {
    const currentSavedItems = this.savedItems.value;
    const updatedSavedItems = currentSavedItems.filter(item => item.artwork.id !== artworkId);
    this.savedItems.next(updatedSavedItems);
    this.saveSavedItems();
    return of(void 0);
  }
} 