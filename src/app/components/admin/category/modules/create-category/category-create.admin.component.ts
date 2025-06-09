import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetailCategoryAdminComponent } from '../detail-category/detail-category.admin.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CategoryDTO } from '../../../../../dtos/category/category.dto';

@Component({
  selector: 'app-category-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './category-create.admin.component.html',
  styleUrl: './category-create.admin.component.scss'
})
export class CategoryCreateAdminComponent {
  categoryProfileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<DetailCategoryAdminComponent>
  ) {
    this.categoryProfileForm = this.formBuilder.group({
      name: ['', [Validators.minLength(3)]],
    })
  }

  closeDialog() {
    this.dialogRef.close('Kết quả bạn muốn trả về khi đóng dialog');
  }

  onCreate() {
    debugger
    const formData = this.categoryProfileForm.value;
    const dto = new CategoryDTO(formData);
    this.categoryService.postCategory(dto).subscribe({
      next: (response: any) => {
        debugger
        // Handle the successful update
        console.log('Create category successfully:', response);
        this.closeDialog()
        // Navigate back to the previous page
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        // Handle the error
        debugger
        console.error('Error create category:', error);
      }
    })
  }
}
