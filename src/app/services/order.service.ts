import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderDTO } from '../dtos/order/order.dto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { OrderResponse } from '../responses/order/order.response';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderCountSubject = new BehaviorSubject<number>(0);
  orderCount$ = this.orderCountSubject.asObservable();

  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;
  private apiGetUserOrders = `${environment.apiBaseUrl}/orders/user`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.loadOrderCount();
  }

  loadOrderCount() {
    debugger
    const userResponse = this.userService.getUserResponseFromLocalStorage();
    if (userResponse?.role.name === 'admin') {
      const params = new HttpParams()
        .set('keyword', "")
        .set('page', 0)
        .set('limit', 1000);
      this.http.get<any>(this.apiGetAllOrders, { params }).subscribe({
        next: (response) => {
          if (response && response.totalOrder) {
            this.orderCountSubject.next(response.totalOrder);
          }
        },
        error: (error) => {
          console.error('Lỗi khi lấy số lượng đơn hàng:', error);
        }
      });
    } else {
      // For regular users, get their own orders count
      this.http.get<any>(this.apiGetUserOrders).subscribe({
        next: (response) => {
          if (response && response.length) {
            this.orderCountSubject.next(response.length);
          }
        },
        error: (error) => {
          console.error('Lỗi khi lấy số lượng đơn hàng:', error);
        }
      });
    }
  }

  updateOrderCount(newCount: number) {
    this.orderCountSubject.next(newCount);
  }

  placeOrder(orderData: OrderDTO): Observable<any> {
    return this.http.post(this.apiUrl, orderData).pipe(
      tap(() => this.incrementOrderCount())
    );
  }

  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }

  updateOrder(orderId: number, orderData: OrderDTO): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put(url, orderData);
  }

  getAllOrders(keyword: string, page: number, limit: number): Observable<OrderResponse[]> {
    debugger
    const userResponse = this.userService.getUserResponseFromLocalStorage();
    if (userResponse?.role.name === 'admin') {
      const params = new HttpParams()
        .set('keyword', keyword)
        .set('page', page.toString())
        .set('limit', limit.toString());
      return this.http.get<any>(this.apiGetAllOrders, { params });
    } else {
      // For regular users, get their own orders
      return this.http.get<any>(this.apiGetUserOrders);
    }
  }

  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
      tap(() => this.decrementOrderCount())
    );
  }

  private incrementOrderCount() {
    const currentCount = this.orderCountSubject.value;
    this.updateOrderCount(currentCount + 1);
  }

  private decrementOrderCount() {
    const currentCount = this.orderCountSubject.value;
    this.updateOrderCount(currentCount - 1);
  }
}