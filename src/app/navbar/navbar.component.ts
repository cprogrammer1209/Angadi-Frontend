import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [WishlistService]
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  currentUser: User | null = null;
  isAuthenticated = false;
  showUserMenu = false;
  searchTerm: string = '';
  wishlistCount: number = 0;
  @Input() name: string='Yuvaraj';  // parent to child binding
  @Output() age : EventEmitter<Number> = new EventEmitter(); // child to parent binding
  

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {
    console.log("name :", this.name);
  }

  ngOnInit() {
    console.log("name :", this.name);
    this.age.emit(15);
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    this.wishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistCount = wishlist.length;
    });

    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.searchService.setSearchTerm(this.searchTerm);
  }

  onSearchSubmit(): void {
    if (this.searchTerm.trim()) {
      this.searchService.setSearchTerm(this.searchTerm);

    }
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearchTerm();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  handleCartClick(): void {
    // if (!this.isAuthenticated) {
    //   // Show a message or redirect to login for checkout
    //   if (confirm('Please sign in to proceed with checkout. Would you like to sign in now?')) {
    //     this.router.navigate(['/login']);
    //   }
    // } else {
    //   // Navigate to cart page (implement as needed)
    //   console.log('Navigate to cart');
    // }
    this.router.navigate(['/cart']);
  }

  // Close user menu when clicking outside
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.showUserMenu = false;
    }
  }
}