import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, bindNodeCallback, of } from 'rxjs';
import * as auth0 from 'auth0-js';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Create Auth0 web auth instance
  // @TODO: Update environment variables and remove .example
  // extension in src/environments/environment.ts.example
  private _Auth0 = new auth0.WebAuth({
    clientID: environment.auth.clientId,
    domain: environment.auth.domain,
    responseType: 'id_token',
    redirectUri: environment.auth.redirect,
    scope: 'openid profile email'
  });
  // Track whether or not to renew token
  private _authFlag = 'isLoggedIn';
  // Create stream of token
  token$: Observable<string>;
  // Create stream for user profile data
  userProfile$ = new BehaviorSubject<any>(null);
  // Authentication navigation
  logoutUrl = '/';
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this._Auth0.checkSession.bind(this._Auth0));

  constructor(private router: Router) { }

  login() {
    // @NOTE: cannot bindNodeCallback for this; it causes errors (why?)
    this._Auth0.popup.authorize({}, (err, authResult) => {
      if (authResult) {
        this._localLogin(authResult);
      } else if (err) {
        this._handleError(err);
      }
    });
  }

  private _localLogin(authResult) {
    if (authResult && authResult.idToken) {
      // Observable of token
      this.token$ = of(authResult.idToken);
      // Emit value for user data subject
      this.userProfile$.next(authResult.idTokenPayload);
      // Set flag in local storage stating this app is logged in
      localStorage.setItem(this._authFlag, JSON.stringify(true));
    } else {
      this._localLogout(true);
    }
  }

  get isAuthenticated(): boolean {
    return JSON.parse(localStorage.getItem(this._authFlag));
  }

  renewAuth() {
    if (this.isAuthenticated) {
      this.checkSession$({}).subscribe(
        authResult => this._localLogin(authResult),
        err => this._handleError(err)
      );
    }
  }

  private _localLogout(redirect?: boolean) {
    // Set authentication status flag in local storage to false
    localStorage.setItem(this._authFlag, JSON.stringify(false));
    // Emit null value for user data subject
    this.userProfile$.next(null);
    // Redirect back to public home if true
    if (redirect) {
      this.router.navigate([this.logoutUrl]);
    }
  }

  logout() {
    this._localLogout();
    // This does a refresh and redirects back to homepage
    // Make sure you have the logout URL in your Auth0
    // Dashboard Application settings in Allowed Logout URLs
    this._Auth0.logout({
      returnTo: environment.auth.logoutUrl,
      clientID: environment.auth.clientId
    });
  }

  private _handleError(err) {
    this._localLogout(true);
    if (err.error_description) {
      console.error(`Error: ${err.error_description}`);
    } else {
      console.error(`Error: ${JSON.stringify(err)}`);
    }
  }

}
