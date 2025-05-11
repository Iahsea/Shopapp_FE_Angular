import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-confirm',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = ''; // Mã giảm giá
  totalAmount: number = 0; // Tổng tiền

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    debugger
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());
    this.productService.getProductsByIds(productIds).subscribe(
      {
        next: (products) => {
          debugger
          this.cartItems = productIds.map((productId) => {
            debugger
            const product = products.find((p) => p.id === productId);
            if (product) {
              product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            }
            return {
              product: product!,
              quantity: cart.get(productId)!
            };
          })
        },
        complete: () => {
          debugger
          this.caculateTotal()
        },
        error: (error: any) => {
          debugger
          console.error('Error fetching order confirm:', error);
        }
      }
    )
  }

  // Hàm tính tổng tiền
  caculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
    // Viết mã xử lý áp dụng mã giảm giá ở đây
    // Cập nhật giá trị totalAmount dựa trên mã giảm giá nếu áp dụng
  }
}
