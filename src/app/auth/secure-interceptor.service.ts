import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

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
      return this.auth.token$
        .pipe(
          filter(token => typeof token === 'string'),
          mergeMap(token => {
            const tokenReq = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            });
            return next.handle(tokenReq);
          })
        );
    }
    return next.handle(req);
  }
}
