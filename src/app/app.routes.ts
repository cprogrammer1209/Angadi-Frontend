import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AuthGuard } from './guards/auth.guard';
import { Wishlist } from './wishlist/wishlist';
import { Cart } from './cart/cart';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ProductListComponent }, // Public access - no auth guard
  { path: 'profile', component: ProductListComponent, canActivate: [AuthGuard] }, // Protected route example
  { path: 'orders', component: ProductListComponent, canActivate: [AuthGuard] }, // Protected route example
  { path: 'wishlists', component: Wishlist},
  { path: 'cart', component: Cart},
  { path: '**', redirectTo: '' }
];
