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

// https://stackoverflow.com/questions/38425461/angular2-canactivate-calling-async-function

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
      // This allows access to the page if the localstorage flag is present,
      // but token and/or checkSession must complete in order for content to be
      // displayed this is done in the page itself.
      // Should this happen in the guard instead? Probably not, because:
      // if so, the flow for that could be complex because
      // guard needs an Observable<boolean> that COMPLETES.
      // Alternately, a boolean can be returned but we'll need to convert an observable
      // or subscription to a boolean and while waiting, navigation will hang.
      // It's probably the least complex to check for the token$ | async in the template
      // of protected pages.
      return true;
    } else {
      // If the user does NOT have a local login flag:
      // save the secure path to redirect to after successful login;
      // redirection then happens in the auth service.
      this.auth.setRedirect(state.url);
      this.router.navigate(['/login']);
      return false;
    }
  }

}
