import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TooltipComponent } from '../../../shared/tooltip/tooltip.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetailCategoryAdminComponent } from './modules/detail-category/detail-category.admin.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CategoryCreateAdminComponent } from './modules/create-category/category-create.admin.component';
import { ToastService } from '../../../services/toast.service';



@Component({
  selector: 'app-category-admin',
  imports: [
    CommonModule,
    MatTableModule,
    TooltipComponent,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
  ],
  templateUrl: './category-admin.component.html',
  styleUrl: './category-admin.component.scss'
})
export class CategoryAdminComponent implements OnInit {
  displayedColumns = [
    'id',
    'name',
    'action'
  ];

  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService,
  ) {

  }

  ngOnInit(): void {
    debugger
    this.getAllCategories(this.currentPage, this.itemsPerPage);
  }

  getAllCategories(page: number, limit: number) {
    debugger
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.categories = response;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching categories:', error);
      }
    })
  }

  loadCategories() {
    this.categoryService.getCategories(this.currentPage, this.itemsPerPage).subscribe(categories => {
      this.categories = categories;
    });
  }

  viewDetails(categoryId: number) {
    const dialogRef = this.dialog.open(DetailCategoryAdminComponent, {
      data: { categoryId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Kết quả trả về khi dialog đóng
        // Gọi lại API lấy danh sách category mới (lazy reload)
        this.loadCategories();
      }
    });
  }

  deleteCategory(categoryId: number) {
    const confirmation = window
      .confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      debugger
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: (response: any) => {
          debugger
          this.loadCategories()
          this.toastService.showSuccess('Category deleted successfully!')
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          this.toastService.showError('Error delete product: ' + error);
        }
      })
    }
  }

  createCategory() {
    const dialogRef = this.dialog.open(CategoryCreateAdminComponent, {
      data: {},
      width: '500px',  // Thiết lập chiều rộng của dialog
      height: 'auto', // Chiều cao tự động, căn cứ vào nội dung form
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Kết quả trả về khi dialog đóng
        // Gọi lại API lấy danh sách category mới (lazy reload)
        this.loadCategories();
      }
    });
  }

}
