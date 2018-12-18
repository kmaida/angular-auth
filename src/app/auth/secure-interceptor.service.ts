import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { filter, mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SecureInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.indexOf('secure') > -1) {
      return this.auth.accessToken$.pipe(
        filter(token => typeof token === 'string'),
        mergeMap(token => {
          const tokenReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(tokenReq);
        }),
        catchError(err => throwError(err))
      );
    }
    return next.handle(req);
  }
}
