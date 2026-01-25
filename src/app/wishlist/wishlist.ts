import { Component } from '@angular/core';
import { WishlistItem, WishlistService } from '../services/wishlist.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';


@Component({ 
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
  providers:[WishlistService]
})
export class Wishlist {
  wishlistItems: WishlistItem[] = [];
  private wishlistSubscription?: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.wishlistSubscription = this.wishlistService.wishlist$.subscribe(item => {
      this.wishlistItems = item;
    })
  }

  ngOnDestroy() {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  moveAllToCart() {
    if (this.wishlistItems.length === 0) return;

    const inStockItems = this.wishlistItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      alert('No items in stock to add to cart.');
      return;
    }

    if (confirm(`Add all ${inStockItems.length} in-stock items to your cart?`)) {
      inStockItems.forEach(item => {
        const cartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
          category: item.category,
          inStock: item.inStock
        };
        this.cartService.addToCart(cartItem);
      });
      alert(`${inStockItems.length} items have been added to your cart!`);
    }
  }
  clearWishlist() {
    try {
      if (this.wishlistItems.length === 0) return;
      if (confirm('Are you sure you want to clear your entire wishlist?')) {
        this.wishlistService.clearWishlist();
      }
    } catch (err) {
      console.log("error while clearing -- ", err);
    }
  }

  getInStockCount(): number {
    const inStockItem = this.wishlistItems.filter(item => item.inStock);
    const inStockCount = inStockItem.length;
    return inStockCount;
  }

  getTotalValue(): number {
    return this.wishlistItems.reduce((total, item) => total + item.price, 0);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  addToCart(item: WishlistItem) {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
      inStock: item.inStock
    };
    this.cartService.addToCart(cartItem);
    alert(`"${item.name}" has been added to your cart! 🛒`);
  }
  removeFromWishlist(productId: number, productName: string) {
    if (confirm(`Remove "${productName}" from your wishlist?`)) {
      this.wishlistService.removeFromWishlist(productId);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
