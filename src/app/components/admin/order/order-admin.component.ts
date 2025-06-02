import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TooltipComponent } from '../../../shared/tooltip/tooltip.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';




@Component({
  standalone: true,
  selector: 'app-order-admin',
  imports: [
    CommonModule,
    MatTableModule,
    TooltipComponent,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './order-admin.component.html',
  styleUrl: './order-admin.component.scss'
})
export class OrderAdminComponent implements OnInit {
  displayedColumns = [
    'id',
    'userId',
    'fullName',
    'email',
    'phoneNumber',
    'address',
    'note',
    'orderDate',
    'status',
    'totalMoney',
    'shippingMethod',
    'shippingAddress',
    'shippingDate',
    'paymentMethod',
    'action',
  ];
  orders: OrderResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 6;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    debugger
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }
  getAllOrders(keyword: string, page: number, limit: number) {
    debugger
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.orders = response.orders;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      }
    });
  }

  loadProducts() {
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 0);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }


  deleteOrder(id: number) {
    const confirmation = window
      .confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      debugger
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          debugger
          this.loadProducts();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error delete order:', error);
        }
      });
    }
  }


  viewDetails(id: number) {
    debugger
    this.router.navigate(['/admin/orders', id]);
  }

}
