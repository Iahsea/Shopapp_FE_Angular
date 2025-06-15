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
import { ToastService } from '../../../../../services/toast.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detail-category-admin',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
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
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: number },
    private dialogRef: MatDialogRef<DetailCategoryAdminComponent>,
    private toastService: ToastService,
  ) {
    this.category_id = data.categoryId;
    this.categoryProfileForm = this.formBuilder.group({
      name: ['', [Validators.minLength(3)]],
    })
  }


  onUpdate() {
    debugger
    const formData = this.categoryProfileForm.value;
    const dto = new CategoryDTO(formData);
    this.categoryService.updateCategory(this.category_id, dto).subscribe({
      next: (response: any) => {
        debugger
        // Handle the successful update
        this.gotoCategoryAdminScreen()
        // Navigate back to the previous page
        console.log(response);

        this.toastService.showSuccess('Category updated successfully: ' + response?.message);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        // Handle the error
        debugger
        console.log(">>>>> error: ", error);

        this.toastService.showError('Error updating category!');
      }
    })
  }

  gotoCategoryAdminScreen() {
    this.dialogRef.close('Kết quả bạn muốn trả về khi đóng dialog');
  }


}
