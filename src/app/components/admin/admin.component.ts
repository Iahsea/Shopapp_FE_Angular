import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderAdminComponent } from './order/order-admin.component';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';




@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
    RouterOutlet,
    MatCardModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  orderCount: number = 0;
  userResponse?: UserResponse | null;
  isCollapsed = false;
  searchText = '';
  userName = 'Admin User';

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: 'dashboard' },
    { label: 'Orders', icon: 'shopping_cart', route: 'orders' },
    { label: 'Categories', icon: 'category', route: 'categories' },
    { label: 'Products', icon: 'inventory_2', route: 'products' },
  ];

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }

  logout() {
    this.userService.removeUserFromLocalStorage();
    this.userService.removeUserFromSessionStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.cartService.resetCartOnLogout();
    this.router.navigate(['/login'])
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  filteredMenu() {
    if (!this.searchText.trim()) return this.menuItems;
    return this.menuItems.filter(item =>
      item.label.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get isMobile() {
    return window.innerWidth <= 768;
  }

}
