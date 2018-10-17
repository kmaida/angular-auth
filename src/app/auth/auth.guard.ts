import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  hasToken: boolean;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // @TODO: guard needs to prompt for login if unauthenticated / no token
    if (this.auth.isAuthenticated) {
      const url = state.url;
      return this.checkToken();
    } else {
      console.log('not authenticated; should prompt for login');
      this.auth.login();
      return false;
    }
  }

  checkToken(): Observable<boolean> {
    return this.auth.token$
      .pipe(
        map(token => {
          if (token) {
            return true;
          } else {
            this.auth.login();
            return false;
          }
        })
      );
    }

}
