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
  // localStorage property names
  private authFlag = 'isLoggedIn';
  private redirect = 'redirect';
  // Store token and create token stream
  token: string = null;
  token$ = new BehaviorSubject<string>(this.token);
  // Create stream of user profile data
  userProfile$ = new BehaviorSubject<any>(null);
  // Store authentication status and create stream
  authStatus = this.isAuthenticated ? 'init_with_auth_flag' : 'init_no_auth_flag';
  authStatus$ = new BehaviorSubject<string>(this.authStatus);
  // Auth-related URL paths
  logoutPath = '/';
  defaultSuccessPath = '/';
  // Create observable of Auth0 parseHash method; gather auth results
  parseHash$ = bindNodeCallback(this.Auth0.parseHash.bind(this.Auth0));
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this.Auth0.checkSession.bind(this.Auth0));
  // Token expiration management
  tokenExp: number;
  refreshSub: Subscription;
  // Hide auth header while performing local login
  // (e.g., on the callback page)
  hideAuthHeader: boolean;

  constructor(private router: Router) { }

  login(autoLogin?: boolean) {
    // Was this triggered by unauthorized access attempt?
    if (!autoLogin) {
      // If user clicked login button, store path
      // to redirect to after successful login
      this.storeAuthRedirect(this.router.url);
      // If login was triggered by an access attempt
      // instead, the route guard will set redirect
    }
    this.Auth0.authorize();
  }

  handleLoginCallback() {
    if (window.location.hash && !this.isAuthenticated) {
      // Hide header while parsing hash
      this.hideAuthHeader = true;
      // Subscribe to parseHash$ bound callback observable
      this.parseHash$({}).subscribe(
        authResult => {
          this.setAuthStatus('parse_hash_begin');
          this.localLogin(authResult);
          this.navigateAfterHashParse();
        },
        err => this.handleError(err)
      );
    } else {
      // If visiting the callback page with no hash
      // return to default logged out route
      this.goToLogoutUrl();
    }
  }

  renewAuth() {
    if (this.isAuthenticated) {
      // App (locally) believes the user is logged in
      this.setAuthStatus('renew_auth');
      // Check Auth0 authorization server session
      this.checkSession$({}).subscribe(
        authResult => this.localLogin(authResult),
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
      this.setAuthStatus('login_error');
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
      this.goToLogoutUrl();
    }
  }

  logout() {
    this.localLogout();
    // Auth0 server logout does a full page redirect:
    // make sure you have full logout URL in your Auth0
    // Dashboard Application settings in Allowed Logout URLs
    this.Auth0.logout({
      returnTo: environment.auth.logoutUrl,
      clientID: environment.auth.clientId
    });
  }

  scheduleRenewal() {
    if (!this.isAuthenticated) { return; }
    // Clean up any previous token renewal
    this.unscheduleRenewal();
    this.setAuthStatus('silent_auth_renewal_setup');
    // Create and subscribe to expiration timer observable
    const expiresIn$ = of(this.tokenExp).pipe(
      mergeMap(exp => timer(Math.max(1, exp - Date.now())))
    );
    this.refreshSub = expiresIn$.subscribe(
      () => {
        this.setAuthStatus('silent_auth_renewal_begin');
        this.renewAuth();
      }
    );
  }

  unscheduleRenewal() {
    if (this.refreshSub) {
      this.setAuthStatus('silent_auth_renewal_removed');
      this.refreshSub.unsubscribe();
    }
  }

  private handleError(err) {
    this.hideAuthHeader = false;
    this.setAuthStatus('login_error');
    console.error(err);
    // Log out locally and redirect to default auth failure route
    this.localLogout(true);
  }

  get isAuthenticated(): boolean {
    // Check if the Angular app thinks this user is authenticated
    return JSON.parse(localStorage.getItem(this.authFlag));
  }

  setAuthStatus(status: string) {
    this.authStatus = status;
    this.authStatus$.next(this.authStatus);
  }

  setToken(token: string) {
    this.token = token;
    this.token$.next(token);
  }

  navigateAfterHashParse() {
    const rd = localStorage.getItem(this.redirect);
    const status = 'parse_hash_redirect_complete';
    if (rd) {
      this.router.navigateByUrl(rd).then(
        navigated => {
          if (navigated) {
            this.hideAuthHeader = false;
            this.setAuthStatus(status);
          }
          this.clearRedirect();
        }
      );
    } else {
      this.clearRedirect();
      this.router.navigateByUrl(this.defaultSuccessPath);
      this.setAuthStatus(status);
    }
  }

  storeAuthRedirect(url: string) {
    localStorage.setItem(this.redirect, url);
  }

  clearRedirect() {
    localStorage.removeItem(this.redirect);
  }

  goToLogoutUrl() {
    this.router.navigate([this.logoutPath]);
  }

}
