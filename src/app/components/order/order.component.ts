import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Product } from '../../models/product';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { environment } from '../../environments/environment';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Order } from '../../models/order';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = ''; // Mã giảm giá
  totalAmount: number = 0; // Tổng tiền
  orderData: OrderDTO = {
    user_id: 37, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form    
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    status: 'pending',
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  };

  isCartEmpty: boolean = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['@gmail.com', [Validators.required, Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      shipping_method: [''],
      payment_method: ['']
    })
  }

  ngOnInit(): void {
    debugger

    const userResponse = this.userService.getUserResponseFromLocalStorage();

    if (userResponse) {
      this.orderData.user_id = userResponse.id;
    }

    this.cartService.getCartObservable().subscribe(cart => {
      const productIds = Array.from(cart.keys());

      if (productIds.length === 0) {
        this.isCartEmpty = true;
        this.cartItems = [];
        return;
      } else {
        this.isCartEmpty = false;
      }

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
            this.calculateTotal()
          },
          error: (error: any) => {
            debugger
            console.error('Error fetching order confirm:', error);
          }
        }
      )

    })

  }

  placeOrder() {
    debugger
    if (this.orderForm.valid) {
      // Gán giá trị từ form vào đối tượng orderData
      /*
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
      */
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: Order) => {
          debugger;
          console.log('Đặt hàng thành công');
          this.cartService.clearCart();
          this.router.navigate(['/orders/', response.id])
          this.toastService.showSuccess('Order placed successfully!');
        },
        complete: () => {
          debugger;
          this.calculateTotal();
        },
        error: (error: any) => {
          debugger;
          console.error('Lỗi khi đặt hàng:', error);
          this.toastService.showError('Error placing order: ' + error);
        },
      });
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      this.toastService.showError('Data is not correct. Please check the data again.');
    }

  }

  // Hàm tính tổng tiền
  calculateTotal(): number {
    return this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  changeQuantity(productId: number, changeBy: number): void {
    debugger
    if (changeBy < 0) {
      this.cartService.removeToCart(productId, -changeBy);
    } else {
      this.cartService.addToCart(productId, changeBy);
    }
  }

}
