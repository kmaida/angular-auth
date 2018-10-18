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
  // Create stream for authentication status
  authStatus = this.isAuthenticated ? 'has_auth_flag' : 'no_auth_flag';
  authStatus$ = new BehaviorSubject<any>(this.authStatus);
  // Authentication navigation
  logoutUrl = '/';
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this._Auth0.checkSession.bind(this._Auth0));
  // Redirect if entering from a protected route after login
  redirectAfterLogin: string;

  constructor(private router: Router) { }

  setAuthStatus(status: string) {
    this.authStatus = status;
    this.authStatus$.next(this.authStatus);
  }

  login() {
    this.setAuthStatus('open_popup');
    // Open popup and authorize request
    this._Auth0.popup.authorize({},
      (err, authResult) => this._authorizeHandler(err, authResult)
    );
  }

  private _authorizeHandler(err, authResult) {
    if (authResult) {
      this._localLogin(authResult);
    }
    if (err) {
      // If there's an error code present,
      // pass error to the error handler
      if (err.code) {
        this._handleError(err);
      } else {
        // If there is no error code present,
        // this could be something benign;
        // e.g., user closed the login popup
        console.log(err.original);
        this.setAuthStatus('login_canceled');
      }
    }
  }

  private _localLogin(authResult) {
    if (authResult && authResult.idToken) {
      // Observable of token
      this.token$ = of(authResult.idToken);
      // Emit value for user data subject
      this.userProfile$.next(authResult.idTokenPayload);
      // Set flag in local storage stating this app is logged in
      localStorage.setItem(this._authFlag, JSON.stringify(true));
      // Set authStatus for successful login
      this.setAuthStatus('login_success');
      // Perform redirect, if one is present
      if (this.redirectAfterLogin) {
        this.doRedirect();
      }
    } else {
      this._localLogout(true);
    }
  }

  get isAuthenticated(): boolean {
    return JSON.parse(localStorage.getItem(this._authFlag));
  }

  setRedirect(path: string) {
    return this.redirectAfterLogin = path;
  }

  doRedirect() {
    this.router.navigate([this.redirectAfterLogin]);
    this.redirectAfterLogin = undefined;
  }

  renewAuth() {
    if (this.isAuthenticated) {
      // Update authStatus
      this.setAuthStatus('renew_auth');
      // Renew authentication session
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
    // Update authStatus
    this.setAuthStatus('local_logout_complete');
    // Redirect back to logout URL if true
    if (redirect) {
      this.router.navigate([this.logoutUrl]);
    }
  }

  logout() {
    // Update authStatus
    this.setAuthStatus('local_logout_begin');
    // Log out locally
    this._localLogout();
    // Auth0 logout does a refresh and redirects back to homepage
    // Make sure you have the logout URL in your Auth0
    // Dashboard Application settings in Allowed Logout URLs
    this._Auth0.logout({
      returnTo: environment.auth.logoutUrl,
      clientID: environment.auth.clientId
    });
  }

  private _handleError(err) {
    // This function runs if there is an error code present
    // Update authStatus
    this.setAuthStatus('login_error');
    this._localLogout(true);
    console.error(err);
  }

}
