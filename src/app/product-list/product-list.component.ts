import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import { WishlistItem, WishlistService } from '../services/wishlist.service';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  selectedCategory = 'All';
  isAuthenticated = false;
  searchTerm: string = '';
  private searchSubscription?: Subscription;
  private wishlistSubscription?: Subscription;
  wishlistItem: WishlistItem[] = [];

  constructor(
    private authService: AuthService,
    public router: Router,
    private searchService: SearchService,
    private WishlistService: WishlistService,
    private cartService : CartService
  ) { }

  ngOnInit() {
    this.loadProducts();

    // Subscribe to authentication status
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term.toLowerCase();
    })

    this.wishlistSubscription = this.WishlistService.wishlist$.subscribe(item => {
      this.wishlistItem = item;
    })

  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  loadProducts() {
    this.products = [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        price: 79.99,
        originalPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        rating: 4.5,
        reviews: 1250,
        category: 'Electronics',
        inStock: true
      },
      { 
        id: 2,
        name: 'Premium Cotton T-Shirt',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
        rating: 4.2,
        reviews: 890,
        category: 'Clothing',
        inStock: true
      },
      {
        id: 3,
        name: 'JavaScript: The Complete Guide',
        price: 39.99,
        originalPrice: 49.99,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop',
        rating: 4.8,
        reviews: 2100,
        category: 'Books',
        inStock: true
      },
      {
        id: 4,
        name: 'Smart Fitness Watch',
        price: 199.99,
        originalPrice: 249.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        rating: 4.3,
        reviews: 756,
        category: 'Electronics',
        inStock: false
      },
      {
        id: 5,
        name: 'Ceramic Plant Pot Set',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop',
        rating: 4.6,
        reviews: 432,
        category: 'Home & Garden',
        inStock: true
      },
      {
        id: 6,
        name: 'Professional Tennis Racket',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
        rating: 4.4,
        reviews: 298,
        category: 'Sports',
        inStock: true
      },
      {
        id: 7,
        name: 'Leather Office Chair',
        price: 299.99,
        originalPrice: 399.99,
        image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&h=300&fit=crop',
        rating: 4.7,
        reviews: 542,
        category: 'Furniture',
        inStock: true
      },
      {
        id: 8,
        name: 'Organic Green Tea (50 Bags)',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&h=300&fit=crop',
        rating: 4.5,
        reviews: 1876,
        category: 'Food & Beverages',
        inStock: true
      },
      {
        id: 9,
        name: 'Digital Camera 4K',
        price: 549.99,
        originalPrice: 699.99,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop',
        rating: 4.6,
        reviews: 389,
        category: 'Electronics',
        inStock: true
      },
      {
        id: 10,
        name: 'Yoga Mat Premium',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop',
        rating: 4.4,
        reviews: 623,
        category: 'Sports',
        inStock: true
      },
      {
        id: 11,
        name: 'Stainless Steel Water Bottle',
        price: 19.99,
        originalPrice: 24.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
        rating: 4.7,
        reviews: 934,
        category: 'Sports',
        inStock: true
      },
      {
        id: 12,
        name: 'Modern Table Lamp',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop',
        rating: 4.3,
        reviews: 267,
        category: 'Home & Garden',
        inStock: false
      },
      {
        id: 13,
        name: 'Running Shoes Pro',
        price: 89.99,
        originalPrice: 119.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
        rating: 4.8,
        reviews: 1542,
        category: 'Sports',
        inStock: true
      },
      {
        id: 14,
        name: 'Cooking Essentials Book',
        price: 27.99,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop',
        rating: 4.5,
        reviews: 478,
        category: 'Books',
        inStock: true
      },
      {
        id: 15,
        name: 'Backpack Travel Edition',
        price: 59.99,
        originalPrice: 79.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
        rating: 4.6,
        reviews: 812,
        category: 'Accessories',
        inStock: true
      },
      {
        id: 16,
        name: 'Wireless Gaming Mouse',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
        rating: 4.4,
        reviews: 695,
        category: 'Electronics',
        inStock: true
      }
    ];
  }
  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  getFilteredProducts() {
    let filtered = this.products;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm) ||
        product.category.toLowerCase().includes(this.searchTerm)
      );
    }

    return filtered;
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  addToCart(product: Product) {
    // if (!this.isAuthenticated) {
    //   // Prompt user to login
    //   if (confirm(`Please sign in to add "${product.name}" to your cart. Would you like to sign in now?`)) {
    //     this.router.navigate(['/login']);
    //   }
    //   return;
    // }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      inStock: product.inStock
    };

    this.cartService.addToCart(cartItem);
    alert(`"${product.name}" has been added to your cart! 🛒`);

    console.log('Added to cart:', product.name);
  }

  buyNow(product: Product) {
    if (!this.isAuthenticated) {
      if (confirm(`Please sign in to purchase "${product.name}". Would you like to sign in now?`)) {
        this.router.navigate(['/login']);
      }
      return;
    }

    console.log('Buy now:', product.name);
    // TODO: Implement checkout functionality
    alert(`Proceeding to checkout for "${product.name}"`);
  }

  isInWishlist(productId: number): boolean {
    return this.WishlistService.isInWishlist(productId);
  }

  addToWishlist(product: Product, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    // if (!this.isAuthenticated) {
    //   if (confirm(`Please sign in to add "${product.name}" to your wishlist. Would you like to sign in now?`)) {
    //     this.router.navigate(['/login']);
    //   }
    //   return;
    // }
    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      inStock: product.inStock,
      addedAt: new Date()
    };
    const added = this.WishlistService.toggleWishlist(wishlistItem);

     if (added) {
      alert(`"${product.name}" has been added to your wishlist....! ❤️`);
    } else {
      alert(`"${product.name}" has been removed from your wishlist.`);
    }

    // console.log('Added to wishlist:', product.name);
    // TODO: Implement wishlist functionality
    // alert(`"${product.name}" has been added to your wishlist!`);
  }
}