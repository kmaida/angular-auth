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
      // This allows access to the page if app thinks user is logged in.
      // Local login flow must complete in order for content to be
      // displayed — done in the guarded page. We don't do this in guard
      // because observable transformations would need to take place to
      // COMPLETE observables that don't currently do so (and shouldn't).
      // KISS solution is to check for "token$ | async" in template
      // of protected pages and display content once it becomes available.
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
