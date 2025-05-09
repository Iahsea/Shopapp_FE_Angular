import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

// @Injectable()

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return next(req);
};


// export class TokenInterceptor implements HttpInterceptor {

//     constructor(private tokenService: TokenService) { }

//     intercept(
//         req: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         const token = this.tokenService.getToken();

//         if (token) {
//             req = req.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//         }

//         return next.handle(req)
//     }
// }
