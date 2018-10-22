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
  // @TODO: Update environment variables and remove .sample
  // extension in src/environments/environment.ts.sample
  // and src/environments/environment.prod.ts.sample
  private Auth0 = new auth0.WebAuth({
    clientID: environment.auth.clientId,
    domain: environment.auth.domain,
    responseType: 'id_token',
    redirectUri: environment.auth.redirect,
    scope: 'openid profile email'
  });
  // LocalStorage prop to track whether app thinks it's logged in locally
  private authFlag = 'isLoggedIn';
  // LocalStorage prop to track redirect after login
  private rd = 'redirect';
  // Create stream of token
  token: string = null;
  token$ = new BehaviorSubject<string>(this.token);
  // Create stream of user profile data
  userProfile$ = new BehaviorSubject<any>(null);
  // Create stream of authentication status
  authStatus = this.isAuthenticated ? 'init_with_auth_flag' : 'init_no_auth_flag';
  authStatus$ = new BehaviorSubject<string>(this.authStatus);
  // Authentication navigation
  logoutPath = '/';
  defaultSuccessPath = '/';
  // Create observable of Auth0 parseHash method to gather auth results
  parseHash$ = bindNodeCallback(this.Auth0.parseHash.bind(this.Auth0));
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this.Auth0.checkSession.bind(this.Auth0));
  // Token expiration management
  tokenExp: number;
  refreshSub: Subscription;

  constructor(private router: Router) { }

  login(autoLogin?: boolean) {
    // Was this triggered by access attempt?
    if (!autoLogin) {
      // If user clicked login button, store URL to
      // redirect to after successful login
      this.storeAuthRedirect(this.router.url);
      // If login was triggered by an access attempt
      // instead, the route guard will set redirect
    }
    this.Auth0.authorize();
  }

  handleLoginCallback() {
    if (window.location.hash && !this.isAuthenticated) {
      this.parseHash$({}).subscribe(
        authResult => {
          this.localLogin(authResult);
          window.location.hash = '';
          this.navigateAfterHashParse();
        },
        err => this.handleError(err)
      );
    }
  }

  private localLogin(authResult) {
    if (authResult && authResult.idToken && authResult.idTokenPayload) {
      // Set token expiration
      this.tokenExp = authResult.idTokenPayload.exp * 1000;
      // Set token in local property and emit in stream
      this.setToken(authResult.idToken);
      // Emit value for user profile stream
      this.userProfile$.next(authResult.idTokenPayload);
      // Set flag in local storage stating app is logged in
      localStorage.setItem(this.authFlag, JSON.stringify(true));
      // Set up silent token renewal for this browser session
      this.scheduleRenewal();
      // Login has succeeded!
      this.setAuthStatus('login_success');
    } else {
      // Something was missing from expected authResult
      this.localLogout(true);
    }
  }

  private localLogout(redirect?: boolean) {
    this.setAuthStatus('local_logout_begin');
    // User data is no longer available
    this.userProfile$.next(null);
    // Token is no longer available
    this.setToken(null);
    // Unschedule silent token renewal
    this.unscheduleRenewal();
    // Clear login redirect, if there was one
    this.clearRedirect();
    // Set auth status flag to false
    localStorage.setItem(this.authFlag, JSON.stringify(false));
    // Local app logout is complete
    this.setAuthStatus('local_logout_complete');
    // Redirect back to logout URL (if param set)
    if (redirect) {
      this.router.navigate([this.logoutPath]);
    }
  }

  logout() {
    // Remove authentication data from Angular app
    this.localLogout();
    // Perform Auth0 authorization server logout next:
    // Auth0 logout does a full page redirect, so
    // make sure you have full logout URL in your Auth0
    // Dashboard Application settings in Allowed Logout URLs
    this.Auth0.logout({
      returnTo: environment.auth.logoutUrl,
      clientID: environment.auth.clientId
    });
  }

  renewAuth() {
    if (this.isAuthenticated) {
      // App (locally) believes a user is logged in
      this.setAuthStatus('renew_auth');
      // Check Auth0 authorization server session
      this.checkSession$({}).subscribe(
        authResult => this.localLogin(authResult),
        err => this.handleError(err)
      );
    }
  }

  scheduleRenewal() {
    // If app thinks it's not logged in or token isn't valid, do nothing
    if (!this.isAuthenticated || !this.tokenValid) { return; }
    // Clean up any previous token renewal
    this.unscheduleRenewal();
    // Scheduling of auto token renewal has begun
    this.setAuthStatus('schedule_silent_auth_renewal');
    // Create and subscribe to expiration timer observable
    const expiresIn$ = of(this.tokenExp).pipe(
      mergeMap(
        expires => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return timer(Math.max(1, expires - now));
        }
      )
    );
    this.refreshSub = expiresIn$.subscribe(
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

  private handleError(err) {
    // If there is an error code present, log out locally
    this.setAuthStatus('login_error');
    this.localLogout(true);
    console.error(err);
  }

  get isAuthenticated(): boolean {
    // Check if the Angular app thinks this user is authenticated
    return JSON.parse(localStorage.getItem(this.authFlag));
  }

  get tokenValid(): boolean {
    // Check if current datetime is before token expiration
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

  // When trying to access a protected route,
  // user will be prompted to log in first.
  // After login, they can be redirected
  private navigateAfterHashParse() {
    const redirect = localStorage.getItem(this.rd);
    if (redirect) {
      this.router.navigateByUrl(redirect);
      this.clearRedirect();
    } else {
      this.router.navigate([this.defaultSuccessPath]);
    }
  }

  storeAuthRedirect(url: string) {
    localStorage.setItem(this.rd, url);
  }

  clearRedirect() {
    localStorage.removeItem(this.rd);
  }

}
