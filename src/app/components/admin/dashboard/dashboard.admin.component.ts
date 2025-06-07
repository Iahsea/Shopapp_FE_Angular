import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './dashboard.admin.component.html',
  styleUrl: './dashboard.admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {

  // Giả sử dữ liệu lấy từ API hoặc database
  totalOrders: number = 120; // Tổng số đơn hàng
  deliveredOrders: number = 80; // Tổng số đơn hàng đã giao
  pendingOrders: number = 30; // Tổng số đơn hàng đang chờ
  canceledOrders: number = 10; // Tổng số đơn hàng đã hủy
  orderCount: number = 0;
  productCount: number = 0;
  categoryCount: number = 0;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {
    orderService.loadOrderCount();
    productService.loadProductCount();
    categoryService.loadCategoryCount();
  }

  ngOnInit(): void {
    debugger
    this.orderService.orderCount$.subscribe(count => {
      this.orderCount = count;
    });
    this.productService.productCount$.subscribe(count => {
      this.productCount = count;
    })
    this.categoryService.categoryCount$.subscribe(count => {
      this.categoryCount = count;
    })
  }
}
