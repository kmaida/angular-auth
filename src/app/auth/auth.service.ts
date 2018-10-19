import { Injectable } from '@angular/core';
import { BehaviorSubject, bindNodeCallback, timer, of, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
  // Track whether app thinks it's logged in locally;
  // used to determine whether or not to allow route access
  // and to decide if authentication renewal should run
  private _authFlag = 'isLoggedIn';
  // Create stream of token
  token: string = null;
  token$ = new BehaviorSubject<string>(this.token);
  // Create stream of user profile data
  userProfile$ = new BehaviorSubject<any>(null);
  // Create stream of authentication status
  authStatus = this.isAuthenticated ? 'init_with_auth_flag' : 'init_no_auth_flag';
  authStatus$ = new BehaviorSubject<string>(this.authStatus);
  // Authentication navigation
  logoutUrl = '/';
  // Create observable of Auth0 popup.authorize method
  // to open a popup that will allow user to log into auth server
  popupAuthorize$ = bindNodeCallback(this._Auth0.popup.authorize.bind(this._Auth0.popup));
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this._Auth0.checkSession.bind(this._Auth0));
  // Store redirect path if entering from a protected route
  redirectAfterLogin: string;
  // Token expiration
  tokenExp: number;
  refreshSub: Subscription;

  constructor(private router: Router) { }

  login() {
    this.setAuthStatus('open_popup');
    this.popupAuthorize$({}).subscribe(
      authResult => this._localLogin(authResult),
      err => this._authorizeErrHandler(err)
    );
  }

  private _authorizeErrHandler(err) {
    // If error code present, pass error to the error handler
    if (err.code) {
      this._handleError(err);
    } else {
      // If no error code present, could be benign,
      // e.g., user closed the login popup
      const _logErr = err.original ? err.original : err;
      console.log(_logErr);
      // Clear secure stored redirect (login canceled)
      this.clearRedirect();
      this.setAuthStatus('login_canceled');
    }
  }

  renewAuth() {
    if (this.isAuthenticated) {
      // Update authStatus stating auth renewal begun
      this.setAuthStatus('renew_auth');
      // App thinks it's logged in; attempt renew auth session
      this.checkSession$({}).subscribe(
        authResult => this._localLogin(authResult),
        err => this._handleError(err)
      );
    }
  }

  private _localLogin(authResult) {
    if (authResult && authResult.idToken) {
      // Set token expiration
      this.tokenExp = authResult.idTokenPayload.exp * 1000;
      // Set token in local property and emit in stream
      this.setToken(authResult.idToken);
      // Emit value for user data subject
      this.userProfile$.next(authResult.idTokenPayload);
      // Set flag in local storage stating app is logged in
      localStorage.setItem(this._authFlag, JSON.stringify(true));
      // Schedule silent token renewal
      this.scheduleRenewal();
      // Emit successful login
      this.setAuthStatus('login_success');
      // Perform redirect, if one is present
      if (this.redirectAfterLogin) {
        this.doRedirect();
      }
    } else {
      this._localLogout(true);
    }
  }

  private _localLogout(redirect?: boolean) {
    // Local logout process has begun
    this.setAuthStatus('local_logout_begin');
    // Set auth status flag in local storage to false
    localStorage.setItem(this._authFlag, JSON.stringify(false));
    // Emit null value for user data subject
    this.userProfile$.next(null);
    // Emit null value for token
    this.setToken(null);
    // Unschedule silent token renewal
    this.unscheduleRenewal();
    // Clear secure stored redirect, if there is one leftover
    this.clearRedirect();
    // Emit value stating local app logout is complete
    this.setAuthStatus('local_logout_complete');
    // Redirect back to logout URL if param set
    if (redirect) {
      this.router.navigate([this.logoutUrl]);
    }
  }

  logout() {
    // Log out of this app (local logout doesn't affect auth server)
    this._localLogout();
    // Perform auth server logout next:
    // Auth0 logout does a full page redirect
    // Make sure you have full logout URL in your Auth0
    // Dashboard Application settings in Allowed Logout URLs
    this._Auth0.logout({
      returnTo: environment.auth.logoutUrl,
      clientID: environment.auth.clientId
    });
  }

  scheduleRenewal() {
    // If token isn't valid, then do nothing
    if (!this.isAuthenticated || !this.tokenValid) { return; }
    // Unsubscribe from previous expiration observable
    this.unscheduleRenewal();
    // Update authStatus to show scheduling of auto token renewal
    this.setAuthStatus('schedule_silent_auth_renewal');
    // Create and subscribe to expiration observable
    const _expiresIn$ = of(this.tokenExp).pipe(
      mergeMap(
        expires => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return timer(Math.max(1, expires - now));
        }
      )
    );

    this.refreshSub = _expiresIn$.subscribe(
      () => {
        this.setAuthStatus('start_silent_auth_renewal');
        this.renewAuth();
        this.scheduleRenewal();
      }
    );
  }

  unscheduleRenewal() {
    if (this.refreshSub) {
      this.setAuthStatus('remove_silent_auth_renewal');
      this.refreshSub.unsubscribe();
    }
  }

  private _handleError(err) {
    // If there is an error code present, log out locally
    this.setAuthStatus('login_error');
    this._localLogout(true);
    console.error(err);
  }

  get isAuthenticated(): boolean {
    // Check if the Angular app thinks this user is authenticated
    return JSON.parse(localStorage.getItem(this._authFlag));
  }

  get tokenValid(): boolean {
    // Check if current time is past token's expiration
    return Date.now() < this.tokenExp;
  }

  setAuthStatus(status: string) {
    this.authStatus = status;
    this.authStatus$.next(this.authStatus);
  }

  setToken(token: string) {
    this.token = token;
    this.token$.next(token);
  }

  setRedirect(path: string) {
    this.redirectAfterLogin = path;
  }

  doRedirect() {
    this.router.navigate([this.redirectAfterLogin]);
    this.clearRedirect();
  }

  clearRedirect() {
    this.setRedirect(undefined);
  }

}
