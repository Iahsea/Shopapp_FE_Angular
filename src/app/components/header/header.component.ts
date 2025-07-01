import { Component, computed, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import e from 'express';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgbPopoverModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;

  lastScrollTop = 0;
  headerVisible = true;

  cartCount: number = 0;


  constructor(
    public userService: UserService,
    private popoverConfig: NgbPopoverConfig,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit() {
    debugger
    this.userResponse = this.userService.getUserResponseFromLocalStorage()
      || this.userService.getUserResponseFromSessionStorage();
    console.log(">>>>> check userResponse", this.userResponse);
    this.cartService.getCartObservable().subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    })
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
      || document.body.scrollTop || 0;

    if (currentScroll > this.lastScrollTop) {
      this.headerVisible = false;
    } else {
      this.headerVisible = true;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }


  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile'])
    }
    else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.userService.removeUserFromSessionStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
      this.cartService.resetCartOnLogout(); // Reset giỏ hàng trong bộ nhớ
      this.router.navigate(['/login'])
    }
    this.isPopoverOpen = false;
  }

}
