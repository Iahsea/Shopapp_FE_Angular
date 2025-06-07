import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CategoryDTO } from '../../../../../dtos/category/category.dto';
import { CategoryService } from '../../../../../services/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-category-admin',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './detail-category.admin.component.html',
  styleUrl: './detail-category.admin.component.scss'
})
export class DetailCategoryAdminComponent {
  category_id: number;
  categoryProfileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { category_id: number },
    private dialogRef: MatDialogRef<DetailCategoryAdminComponent>
  ) {
    this.category_id = data.category_id;
    this.categoryProfileForm = this.formBuilder.group({
      name: ['', [Validators.minLength(3)]],
    })
  }

  // Các phương thức khác của component

  closeDialog() {
    this.dialogRef.close('Kết quả bạn muốn trả về khi đóng dialog');
  }


  onUpdate() {
    debugger
    const formData = this.categoryProfileForm.value;
    const dto = new CategoryDTO(formData);
    this.categoryService.updateCategory(this.category_id, dto).subscribe({
      next: (response: any) => {
        debugger
        // Handle the successful update
        console.log('Category updated successfully:', response);
        this.closeDialog()
        // Navigate back to the previous page
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        // Handle the error
        debugger
        console.error('Error updating category:', error);
      }
    })
  }



}
