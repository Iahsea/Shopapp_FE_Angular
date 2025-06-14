import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 20000,
      panelClass: ['toast-success'],
      verticalPosition: 'top',  // Đặt thông báo ở trên cùng của trang
      horizontalPosition: 'center'  // Đặt thông báo ở giữa theo chiều ngang
    })
  }

  showError(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 360000,
      panelClass: ['toast-error'],
      verticalPosition: 'top',  // Đặt thông báo ở trên cùng của trang
      horizontalPosition: 'center'  // Đặt thông báo ở giữa theo chiều ngang
    })
  }

  showInfo(message: string) {
    this.snackBar.open(message, 'Dissmis', {
      duration: 3000,
      panelClass: ['toast-info'],
      verticalPosition: 'top',  // Đặt thông báo ở trên cùng của trang
      horizontalPosition: 'center'  // Đặt thông báo ở giữa theo chiều ngang
    })
  }

  showWarning(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: ['toast-warning'],
      verticalPosition: 'top',  // Đặt thông báo ở trên cùng của trang
      horizontalPosition: 'center'  // Đặt thông báo ở giữa theo chiều ngang
    })
  }
}
