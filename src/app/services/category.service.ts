import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Category } from '../models/category';
import { CategoryDTO } from '../dtos/category/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryCountSubject = new BehaviorSubject<number>(0);
  categoryCount$ = this.categoryCountSubject.asObservable();


  private apiGetCategories = `${environment.apiBaseUrl}/categories`;



  constructor(private http: HttpClient) {
    this.loadCategoryCount()
  }

  loadCategoryCount() {
    debugger
    const params = new HttpParams()
      .set('page', 0)
      .set('limit', 100);
    return this.http.get<[Category]>(this.apiGetCategories, { params }).subscribe({
      next: (response) => {
        debugger
        if (response && response.length) {
          this.categoryCountSubject.next(response.length);  // Cập nhật totalCount vào BehaviorSubject
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy số lượng danh mục sản phẩm:', error);
      }
    })
  }

  updateCategoryCount(newCount: number) {
    this.categoryCountSubject.next(newCount);
  }

  getCategories(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<[Category]>(this.apiGetCategories, { params });
  }

  updateCategory(categoryId: number, categoryData: CategoryDTO): Observable<any> {
    debugger
    const url = `${environment.apiBaseUrl}/categories/${categoryId}`;
    return this.http.put(url, categoryData)
  }

  deleteCategory(categoryId: number): Observable<any> {
    debugger
    const url = `${environment.apiBaseUrl}/categories/${categoryId}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
      tap(() => this.decrementCategoryCount())
    );
  }

  private incrementCategoryCount() {
    const currentCount = this.categoryCountSubject.value;
    this.updateCategoryCount(currentCount + 1);
  }

  private decrementCategoryCount() {
    const currentCount = this.categoryCountSubject.value;
    this.updateCategoryCount(currentCount - 1);
  }
}
