import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false); // BehaviorSubject giữ trạng thái loading
  loading$ = this.loadingSubject.asObservable();// Observable để các component có thể subscribe

  constructor() { }


  show() {
    this.loadingSubject.next(true); // Hiển thị thanh loading
  }

  hide() {
    this.loadingSubject.next(false); // Ẩn thanh loading
  }
}
