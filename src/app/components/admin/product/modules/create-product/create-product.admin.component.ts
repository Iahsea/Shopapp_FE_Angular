import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ProductDTO } from '../../../../../dtos/product/product.dto';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-create-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    MatIconModule
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
    private productService: ProductService,
    private toastService: ToastService,

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
          // Navigate back to the previous page
          this.router.navigate(['../products'], { relativeTo: this.activateRoute });
          this.toastService.showSuccess('Created Product successfully')
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          // Handle the error
          debugger
          this.toastService.showError('Error creating product ' + error?.error?.message);
        }
      })
  }


}
