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
import { ProductAdminComponent } from '../product/product-admin.component';

@Component({
  selector: 'app-category-admin',
  imports: [
    CommonModule,
    MatTableModule,
    TooltipComponent,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
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
    private dialog: MatDialog
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

  viewDetails(category_id: number) {
    const dialogRef = this.dialog.open(ProductAdminComponent, {
      width: '400px',
      data: { /* truyền dữ liệu */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog đóng lại với kết quả:', result);
    });
  }

  deleteCategory(category_id: number) {

  }

}
