import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ProductDTO } from '../../../../../dtos/product/product.dto';

@Component({
  selector: 'app-create-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './create-product.admin.component.html',
  styleUrl: './create-product.admin.component.scss'
})
export class CreateProductAdminComponent {
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
      description: [''],
      category_id: ['']
    })
  }

  onCreate() {
    debugger
    const formData = this.productProfileForm.value;
    const dto = new ProductDTO(formData);
    this.productService.createProduct(dto)
      .subscribe({
        next: (response: any) => {
          debugger
          // Handle the successful update
          console.log('Created Product successfully:', response);
          // Navigate back to the previous page
          this.router.navigate(['../products'], { relativeTo: this.activateRoute });
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          // Handle the error
          debugger
          console.error('Error creating product:', error);
        }
      })
  }
}
