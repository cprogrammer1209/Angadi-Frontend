import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem, CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription?: Subscription;
  taxRate: number = 0.18;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartSubscription = this.cartService.cart$.subscribe(item => {
      this.cartItems = item;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  clearCart(): void {
    if (this.cartItems.length === 0) {
      return;
    }
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  removeFromCart(productId: number, productName: string): void {
    if (confirm(`Remove "${productName}" from your cart?`)) {
      this.cartService.removeFromCart(productId);
    }
  }
  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }
  getTotal(): number {
    return this.cartService.getGrandTotal(this.taxRate);
  }
  getTax(): number {
    return this.cartService.getTax(this.taxRate);
  }

  getShipping(): number {
    return this.cartService.getShipping();
  }

   getSavings(item: CartItem): number {
    if (!item.originalPrice) return 0;
    return (item.originalPrice - item.price) * item.quantity;
  }

  getTotalSavings(): number {
    return this.cartItems.reduce((total, item) => total + this.getSavings(item), 0);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const outOfStockItems = this.cartItems.filter(item => !item.inStock);
    if (outOfStockItems.length > 0) {
      alert(`Please remove out of stock items before checkout: ${outOfStockItems.map(i => i.name).join(', ')}`);
      return;
    }


    alert('Proceeding to checkout...');
    console.log('Checkout items:', this.cartItems);
    console.log('Total:', this.getTotal());
  }

}
