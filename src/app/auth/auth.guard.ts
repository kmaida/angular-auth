import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

// https://stackoverflow.com/questions/38425461/angular2-canactivate-calling-async-function

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated) {
      // This allows access to the page if app thinks user is logged in.
      // Local login flow must complete in order for content to be
      // displayed — done in the guarded page. We don't do this in guard
      // because observable transformations would need to take place to
      // COMPLETE observables that don't currently do so (and shouldn't).
      // KISS solution is to check for "token$ | async" in template
      // of protected pages and display content once it becomes available.
      return true;
    }
    // Save secure path to redirect to after successful login and prompt to log in
    this.auth.storeAuthRedirect(state.url);
    this.auth.login(true);
    return false;
  }

}
