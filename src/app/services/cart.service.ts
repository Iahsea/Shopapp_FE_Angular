import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ProductService } from './product.service';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Map<number, number> = new Map(); // Dùng Map để lưu trữ giỏ hàng, key là id sản phẩm, value là số lượng
  private isBrowser: boolean;
  private cartSubject: BehaviorSubject<Map<number, number>>;

  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service (chỉ thực hiện khi chạy trên trình duyệt)
    this.cartSubject = new BehaviorSubject(this.cart)
    this.refreshCart();
  }

  public refreshCart() {
    if (this.isBrowser) {
      const storedCart = localStorage.getItem(this.getCartKey());
      if (storedCart) {
        this.cart = new Map(JSON.parse(storedCart));
      } else {
        this.cart = new Map<number, number>();
      }

    }
    this.cartSubject.next(this.cart);
  }

  public resetCartOnLogout(): void {
    // Đặt lại giỏ hàng về trạng thái trống trong bộ nhớ của ứng dụng
    this.cart.clear();
    this.cartSubject.next(this.cart); // Cập nhật giỏ hàng trống vào BehaviorSubject
    // Không xóa giỏ hàng trong localStorage, để khi người dùng đăng nhập lại, giỏ hàng vẫn còn
  }


  private getCartKey(): string {
    const userResponseJSON = localStorage.getItem('user');
    const userResponse = JSON.parse(userResponseJSON!);
    return `cart:${userResponse?.id}`;
  }

  getCart(): Map<number, number> {
    return this.cart;
  }

  getCartObservable() {
    return this.cartSubject.asObservable(); // Trả về Observable để các component có thể subscribe
  }


  // Lấy số lượng sản phẩm trong giỏ hàng
  getCartCount(): number {
    let total = 0;
    this.cart.forEach(quantity => total += quantity);
    return total;
  }

  removeToCart(productId: number, quantity: number = 1): void {
    debugger
    if (this.cart.has(productId)) {
      const newQuantity = this.cart.get(productId)! - quantity;
      if (newQuantity <= 0) {
        this.cart.delete(productId);
      } else {
        this.cart.set(productId, newQuantity);
      }
    }
    this.saveCartToLocalStorage();
    this.cartSubject.next(this.cart)
  }

  addToCart(productId: number, quantity: number = 1): void {
    debugger
    if (this.cart.has(productId)) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên `quantity`
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào với số lượng là `quantity`
      this.cart.set(productId, quantity);
    }
    // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage
    this.saveCartToLocalStorage();
    this.cartSubject.next(this.cart);
  }


  // Lưu trữ giỏ hàng vào localStorage
  private saveCartToLocalStorage(): void {
    debugger
    localStorage.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
  }

  // Hàm xóa dữ liệu giỏ hàng và cập nhật Local Storage
  clearCart(): void {
    this.cart.clear() // Xóa toàn bộ dữ liệu trong giỏ hàng
    this.saveCartToLocalStorage(); //Lưu giỏ hàng mới vào Local Storage (trống)
    this.cartSubject.next(this.cart);
  }

}
