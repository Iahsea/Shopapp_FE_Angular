import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private loadingService: LoadingService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isPlatformBrowser(this.platformId)) {
            debugger
            console.log('TokenInterceptor is called');
            let token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

            // Hiển thị loading spinner trước khi gửi yêu cầu 
            this.loadingService.show();

            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        }

        return next.handle(req).pipe(
            finalize(() => {
                // Ẩn spinner khi request hoàn tất ( hoặc lỗi )
                this.loadingService.hide();
            })
        );
    }
}
