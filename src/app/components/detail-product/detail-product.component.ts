import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { error } from 'console';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-detail-product',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    // Lấy productId từ URL 
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger

    if (idParam !== null) {
      this.productId = +idParam;
    }

    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe(
        {
          next: (response: any) => {
            debugger
            if (response.productImages && response.productImages.length > 0) {
              response.productImages = response.productImages.map((img: string) => {
                return {
                  image_url: `${environment.apiBaseUrl}/products/images/${img}`
                };
              });
            }
            debugger
            this.product = response;
            // Bắt đầu với ảnh đầu tiên
            this.showImage(0);
          },
          complete: () => {
            debugger
          },
          error: (error: any) => {
            debugger
            console.error('Error fetching detail:', error);
          }
        }
      )
    }

  }

  showImage(index: number): void {
    debugger
    if (this.product && this.product.productImages &&
      this.product.productImages.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.productImages.length) {
        index = this.product.productImages.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index;
  }

  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }
  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    debugger
    if (this.product) {
      this.cartService.addToCart(this.productId, this.quantity);
      this.toastService.showSuccess('Item successfully added to your cart!')
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {
    debugger
    this.quantity++;
  }

  decreaseQuantity(): void {
    debugger
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    debugger
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }


  buyNow(): void {
    this.router.navigate(['/orders']);
  }
}
