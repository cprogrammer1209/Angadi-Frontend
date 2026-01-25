import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface WishlistItem {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    category: string;
    inStock: boolean;
    addedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private wishlistKey = 'ecommerce_wishlist';
    private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
    public wishlist$: Observable<WishlistItem[]> = this.wishlistSubject.asObservable();

    constructor() {
        this.loadWishlist();
    }

    private loadWishlist(): void {
        try {
            const stored = localStorage.getItem(this.wishlistKey);
            if (stored) {
                const item = JSON.parse(stored) as WishlistItem[];
                this.wishlistSubject.next(item);
            }
        } catch (err) {
            console.error('Error loading wishlist from localStorage', err);
        }

    }

    private saveWishlist(wishlist: WishlistItem[]): void {
        try {
            localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
            this.wishlistSubject.next(wishlist);
        }
        catch (err) {
            console.error('Error saving wishlist to localStorage', err);
        }

    }

    getWishlist(): WishlistItem[] {
        return this.wishlistSubject.getValue();
    }

    addToWishlist(item: WishlistItem): boolean {
        try {
            const currentWishList = this.getWishlist();
            if (this.isInWishlist(item.id)) {
                return false;
            }
            const newItem = {
                ...item,
                addedAt: new Date()
            };

            const updatedWishList = [...currentWishList, newItem];

            this.saveWishlist(updatedWishList);

            return true;
        } catch (err) {
            console.error('Error adding item to wishlist', err);
        }
        return true;
    }
    isInWishlist(productId: number): boolean {
        return this.getWishlist().some(item => item.id === productId);
    }

    // removeFromWishlist(productId: number): void {
    //     const currentWishList = this.wishlistSubject.getValue();
    //     const updatedWishList = currentWishList.filter(item => { item.id !== productId });
    //     this.saveWishlist(updatedWishList);
    // }

    removeFromWishlist(productId: number): void {
        const currentWishlist = this.getWishlist();
        const updatedWishlist = currentWishlist.filter(item => item.id !== productId);
        this.saveWishlist(updatedWishlist);
    }

    toggleWishlist(item: WishlistItem): boolean {
        if (this.isInWishlist(item.id)) {
            this.removeFromWishlist(item.id);
            return false;
        } else {
            this.addToWishlist(item);
            return true;
        }
    }

    clearWishlist(): void {
        this.saveWishlist([]);
    }

    getWishlistCount(): number {
        return this.getWishlist.length;
    }

}