import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../models/product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../../environments/environment';
import { ProductService } from '../../../../../services/product.service';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../../../../dtos/product/product.dto';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../../services/toast.service';


@Component({
  selector: 'app-detail-product-admin',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './detail-product.admin.component.html',
  styleUrl: './detail-product.admin.component.scss'
})
export class DetailProductAdminComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  productProfileForm: FormGroup;

  fileName: string | null = null;
  requiredFileType: string = 'image/*';
  checkUpload: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private http: HttpClient,
    private toastService: ToastService,
  ) {
    this.productProfileForm = this.formBuilder.group({
      name: ['', [Validators.minLength(3)]],
      price: ['', [Validators.min(0), Validators.max(10000000)]],
      thumbnail: [''],
      description: [''],
      category_id: ['']
    })
  }

  ngOnInit() {
    const idParam = this.activateRoute.snapshot.paramMap.get('id');

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
            this.productProfileForm.patchValue({
              name: this.product?.name || '',
              price: this.product?.price || '',
              thumbnail: this.product?.productImages[0]?.image_url || '',
              description: this.product?.description || '',
              category_id: this.product?.category_id || ''
            });
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

  onUpdate() {
    debugger
    const formData = this.productProfileForm.value;
    const dto = new ProductDTO(formData);
    this.productService.updateProduct(this.productId, dto)
      .subscribe({
        next: (response: any) => {
          debugger
          // Handle the successful update
          console.log('Product updated successfully:', response);

          // Navigate back to the previous page
          this.router.navigate(['../'], { relativeTo: this.activateRoute });
          this.toastService.showSuccess('Product updated successfully:');
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          // Handle the error
          debugger
          console.error('Error updating product:', error);
          this.toastService.showError('Error updating product: ' + error?.error?.message)
        }
      })
  }

  OnClickToProductDetail(productId?: number) {
    if (productId != null) {
      this.router.navigate(['/products', productId]);
    } else {
      console.warn('Product ID is undefined');
    }
  }

  onFileSelected(event: any) {
    debugger
    const idParam = this.activateRoute.snapshot.paramMap.get('id');
    const url = `${environment.apiBaseUrl}/products/uploads/${idParam}`;
    const files: FileList = event.target.files; // Lấy tất cả các tệp đã chọn

    if (files && files.length > 0) {

      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      this.http.post(url, formData).subscribe({
        next: (response: any) => {
          debugger
          console.log('Upload image of product successfully:', response);

          if (this.product) {
            debugger

            response.forEach((image: any) => {
              const newImageUrl = `${environment.apiBaseUrl}/products/images/${image.imageUrl}`;

              // Thêm ảnh mới vào mảng productImages (lưu ý, đây chỉ là cập nhật tạm thời trong client-side chứ chưa lưu vào database)
              // Có tác dụng thay đổi để Angular phát hiện và tự động cập nhật

              // Cập nhật lại thumbnail nếu cần

              this.product?.productImages.push({
                image_url: newImageUrl,
                id: image.id
              });

              this.productProfileForm.patchValue({
                thumbnail: image.imageUrl
              });
            })
          }
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          // Handle the error
          debugger
          console.error('Error upload image of product:', error);
        }
      })

    }
  }

  onThumbnailSelected(image: any) {
    debugger;

    // Lấy phần tên ảnh từ image_url (cắt bỏ phần trước '/images/')
    const imageName = image.image_url.split('/images/')[1];

    // Cập nhật thumbnail trong form với tên ảnh
    this.productProfileForm.patchValue({
      thumbnail: imageName
    });
  }

  getImageName(imageUrl: string): string {
    // Lấy phần tên ảnh từ image_url (cắt bỏ phần trước '/images/')
    return imageUrl.split('/images/')[1];
  }


}
