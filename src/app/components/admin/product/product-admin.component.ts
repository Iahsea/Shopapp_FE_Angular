import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TooltipComponent } from '../../../shared/tooltip/tooltip.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-admin',
  imports: [
    CommonModule,
    MatTableModule,
    TooltipComponent,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './product-admin.component.html',
  styleUrl: './product-admin.component.scss'
})
export class ProductAdminComponent implements OnInit {
  displayedColumns = [
    'id',
    'name',
    'price',
    'created_at',
    'updated_at',
    'category_id',
    'action'
  ];

  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 12;
  page: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";

  constructor(
    private productService: ProductService,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.getProduct(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProduct(keyword: string, categoryId: number, page: number, limit: number) {
    this.productService.getProducts(keyword, categoryId, page, limit).subscribe(
      {
        next: (response: any) => {
          debugger
          response.products.forEach((product: Product) => {
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            // Format created_at và updated_at nếu là array
            if (Array.isArray(product.created_at)) {
              product.created_at = this.formatDateTime(product.created_at);
            }
            if (Array.isArray(product.updated_at)) {
              product.updated_at = this.formatDateTime(product.updated_at);
            }
          });

          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
          debugger

        },
        error: (error: any) => {
          debugger
          console.log('Error fetching products:', error);
        }
      }
    )
  }

  formatDateTime(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 6) return '';

    const [year, month, day, hour, minute, second] = dateArray;

    // Tháng trong mảng thường là 1-12, không cần trừ 1
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
  }

  onPageChange(page: number) {
    debugger
    this.currentPage = page;
    this.getProduct(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 0);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  deleteOrder(id: number) {

  }


  viewDetails(id: number) {

  }
}
