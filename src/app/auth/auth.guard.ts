import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

// @TODO: https://stackoverflow.com/questions/38425461/angular2-canactivate-calling-async-function

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
    if (this.auth.isAuthenticated) {
      // This allows access to the page, but token and/or checkSession must complete
      // in order for content to be displayed; this is done in the page itself.
      // Should this happen in the guard instead? If so, the flow for that could be
      // sort of complex, because guard needs an Observable<boolean> that COMPLETES.
      // Alternately, a boolean can be returned but we'll need to convert an observable
      // or subscription to a boolean and while waiting, navigation will hang.
      return true;
    } else {
      // @TODO: should change this to work more elegantly
      // This should open the login box!
      // Currently what happens when the login method is called is
      // that there is a JSON parsing error thrown by auth0.js
      this.auth.setRedirect(state.url);
      this.auth.login();
      return false;
    }
  }

}
