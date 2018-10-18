import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

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
      // Ensure token availability: ngIf="token$ | async"
      // in secure component's template
      const tokenReq = req.clone({
        setHeaders: { Authorization: `Bearer ${this.auth.token}` }
      });
      return next.handle(tokenReq);
    }
    return next.handle(req);
  }
}
