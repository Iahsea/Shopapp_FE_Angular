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


@Component({
  selector: 'app-detail-product-admin',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './detail-product.admin.component.html',
  styleUrl: './detail-product.admin.component.scss'
})
export class DetailProductAdminComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  productProfileForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
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
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          // Handle the error
          debugger
          console.error('Error updating product:', error);
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

}
