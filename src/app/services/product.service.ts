import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Product } from '../models/product';
import { ProductDTO } from '../dtos/product/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiGetProducts = `${environment.apiBaseUrl}/products`;

  private productCountSubject = new BehaviorSubject<number>(0);
  productCount$ = this.productCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProductCount();
  }

  loadProductCount() {
    debugger
    const params = new HttpParams()
      .set('keyword', "")
      .set('category_id', "")
      .set('page', 0)
      .set('limit', 10);
    this.http.get<any>(this.apiGetProducts, { params }).subscribe({
      next: (response) => {
        debugger
        if (response && response.totalProduct) {
          this.productCountSubject.next(response.totalProduct);  // Cập nhật totalCount vào BehaviorSubject
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy số lượng sản phẩm:', error);
      }
    })
  }

  updateProductCount(newCount: number) {
    this.productCountSubject.next(newCount);
  }

  getProducts(keyword: string, categoryId: number, page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword.toString())
      .set('category_id', categoryId.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<[Product]>(this.apiGetProducts, { params });
  }

  getDetailProduct(productId: number) {
    return this.http.get(`${environment.apiBaseUrl}/products/${productId}`);
  }

  createProduct(productData: ProductDTO): Observable<any> {
    debugger
    const url = `${environment.apiBaseUrl}/products`;
    return this.http.post(url, productData);
  }

  getProductsByIds(productIds: number[]): Observable<Product[]> {
    // Chuyển danh sách ID thành một chuỗi và truyền vào params
    debugger
    if (productIds.length === 0) {
      // Trả về Observable rỗng nếu không có productId nào
      return of([]);
    }
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, { params });
  }

  deleteProduct(productId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/products/${productId}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
      tap(() => this.decrementProductCount())
    )
  }

  updateProduct(productId: number, productData: ProductDTO): Observable<any> {
    debugger
    const url = `${environment.apiBaseUrl}/products/${productId}`;
    return this.http.put(url, productData)
  }

  private incrementProductCount() {
    const currentCount = this.productCountSubject.value;
    this.updateProductCount(currentCount + 1);
  }

  private decrementProductCount() {
    const currentCount = this.productCountSubject.value;
    this.updateProductCount(currentCount - 1);
  }
}

