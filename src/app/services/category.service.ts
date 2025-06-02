import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryDTO } from '../dtos/category/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiGetCategories = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) { }

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
    return this.http.delete(url, { responseType: 'text' });
  }

}
