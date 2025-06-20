import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';

@Component({
    selector: 'app-home',
    imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = []; // Dữ liệu động từ categoryService
    selectedCategoryId: number = 0; // Giá trị category được chọn
    currentPage: number = 0;
    itemsPerPage: number = 12;
    page: number[] = [];
    totalPages: number = 0;
    visiblePages: number[] = [];
    keyword: string = '';

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private router: Router,
        private cartService: CartService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.getProduct(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
        this.getCategory(1, 100);
    }

    getCategory(page: number, limit: number) {
        this.categoryService.getCategories(page, limit).subscribe({
            next: (categories: Category[]) => {
                debugger;
                this.categories = categories;
            },
            complete: () => {
                debugger;
            },
            error: (error: any) => {
                debugger;
                console.log('Error fetching categories:', error);
            },
        });
    }

    searchProducts() {
        this.currentPage = 0;
        this.itemsPerPage = 12;
        debugger;
        this.getProduct(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }

    getProduct(keyword: string, categoryId: number, page: number, limit: number) {
        this.productService.getProducts(keyword, categoryId, page, limit).subscribe({
            next: (response: any) => {
                debugger;
                response.products.forEach((product: Product) => {
                    product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
                });
                this.products = response.products;
                this.totalPages = response.totalPages;
                this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
            },
            complete: () => {
                debugger;
            },
            error: (error: any) => {
                debugger;
                console.log('Error fetching products:', error);
            },
        });
    }

    onPageChange(page: number) {
        debugger;
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
    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    onProductClick(productId: number) {
        debugger;
        // Điều hướng đến trang detail-product với productId là tham số
        this.router.navigate(['/products', productId]);
    }

    addToCart(productId: number) {
        debugger;
        this.cartService.addToCart(productId, 1);
        this.toastService.showSuccess('Item successfully added to your cart!');
    }

    buyNow() {
        this.router.navigate(['/orders']);
    }
}
