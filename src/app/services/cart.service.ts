import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    quantity: number;
    inStock: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartKey = 'ecommerce_cart';
    private cartSubject = new BehaviorSubject<CartItem[]>([]);
    public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

    constructor() {
        this.loadCart();
    }

    private loadCart(): void {
        try {
            const stored = localStorage.getItem(this.cartKey);
            if (stored) {
                const Items = JSON.parse(stored);
                this.cartSubject.next(Items);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }
    private saveCart(items: CartItem[]): void {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(items));
            this.cartSubject.next(items)
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    getCart(): CartItem[] {
        return this.cartSubject.getValue();
    }

    addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): boolean {

        const currentCart = this.getCart();
        const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
        if (existingItemIndex > -1) {
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            const newItem = {
                ...item,
                quantity
            };
            currentCart.push(newItem);
        }
        this.saveCart(currentCart);
        return true;
    }
    removeFromCart(productId: number): void {
        try {
            const currentCart = this.getCart();
            const updatedCart = currentCart.filter(item => item.id !== productId);
            this.saveCart(updatedCart);
        } catch (error) {
            console.error('Error removing product from the cart:', error);
        }
    }

    updateQuantity(productId: number, quantity: number): void {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        const currentCart = this.getCart();
        const itemIndex = currentCart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            currentCart[itemIndex].quantity = quantity;
            this.saveCart(currentCart);
        }
    }

    increaseQuantity(productId: number): void {
        const currentCart = this.getCart();
        const item = currentCart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }
    decreaseQuantity(productId: number): void {
        const currentCart = this.getCart();
        const item = currentCart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }
    isInCart(productId: number): boolean {
        return this.getCart().some(item => item.id === productId);
    }

    getItemQuantity(productId: number): number {
        const item = this.getCart().find(item => item.id === productId);
        return item ? item.quantity : 0;
    }

    clearCart(): void {
        this.saveCart([]);
    }
    getCartCount(): number {
        return this.getCart().reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal(): number {
        return this.getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getSubtotal(): number {
        return this.getCartTotal();
    }

    getTax(taxRate: number = 0.18): number {
        return this.getSubtotal() * taxRate;
    }

    getShipping(): number {
        const subtotal = this.getSubtotal();
        // Free shipping over ₹500
        return subtotal >= 500 ? 0 : 50;
    }

    getGrandTotal(taxRate: number = 0.18): number {
        return this.getSubtotal() + this.getTax(taxRate) + this.getShipping();
    }
}