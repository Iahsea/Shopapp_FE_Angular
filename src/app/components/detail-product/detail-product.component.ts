import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { error } from 'console';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

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

  constructor(private productService: ProductService) { }

  ngOnInit() {
    debugger
    const idParam = 1;
    if (idParam !== null) {
      this.productId = +idParam;
    }

    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(idParam).subscribe(
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
}
