import { Injectable } from '@angular/core';
import { BehaviorSubject, bindNodeCallback, timer, of, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import { environment } from './../../environments/environment';
import { Location } from '@angular/common';
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
    responseType: 'token id_token',
    audience: environment.auth.audience,
    redirectUri: environment.auth.redirect,
    scope: 'openid profile email read:dino-details write:dino-fav read:admin'
  });
  // localStorage property names
  private authFlag = 'isLoggedIn';
  private redirect = 'redirect';
  // Store access token and create stream
  accessToken: string = null;
  accessToken$ = new BehaviorSubject<string>(this.accessToken);
  // Create stream of user profile data
  userProfile$ = new BehaviorSubject<any>(null);
  // Auth-related URL paths
  logoutPath = '/';
  defaultSuccessPath = '/';
  // Create observable of Auth0 parseHash method; gather auth results
  parseHash$ = bindNodeCallback(this.Auth0.parseHash.bind(this.Auth0));
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this.Auth0.checkSession.bind(this.Auth0));
  // Token expiration management
  accessTokenExp: number;
  refreshSub: Subscription;
  // Hide auth header while performing local login
  // (e.g., on the callback page)
  hideAuthHeader: boolean;

  constructor(
    private router: Router,
    private location: Location
  ) { }

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
          // Don't keep the hash in history
          this.location.replaceState('/');
          // Log in locally and navigate
          this.localLogin(authResult);
          this.navigateAfterParseHash();
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
      // Check Auth0 authorization server session
      this.checkSession$({}).subscribe(
        authResult => this.localLogin(authResult),
        err => this.handleError(err)
      );
    }
  }

  private localLogin(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken && authResult.idTokenPayload) {
      // Set token expiration
      const now = new Date();
      const expInMs = authResult.expiresIn * 1000;
      this.accessTokenExp = now.getTime() + expInMs;
      // Set token in local property and emit in stream
      this.setToken(authResult.accessToken);
      // Emit value for user profile stream
      this.userProfile$.next(authResult.idTokenPayload);
      // Set flag in local storage stating app is logged in
      localStorage.setItem(this.authFlag, JSON.stringify(true));
      // Set up silent token renewal for this browser session
      this.scheduleRenewal();
    } else {
      // Something was missing from expected authResult
      this.localLogout(true);
    }
  }

  private localLogout(redirect?: boolean) {
    this.userProfile$.next(null);
    this.setToken(null);
    this.unscheduleRenewal();
    this.clearRedirect();
    localStorage.setItem(this.authFlag, JSON.stringify(false));
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
    // Create and subscribe to expiration timer observable
    const expiresIn$ = of(this.accessTokenExp).pipe(
      mergeMap(exp => timer(Math.max(1, exp - Date.now())))
    );
    this.refreshSub = expiresIn$.subscribe(
      () => this.renewAuth()
    );
  }

  unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  private handleError(err) {
    this.hideAuthHeader = false;
    console.error(err);
    // Log out locally and redirect to default auth failure route
    this.localLogout(true);
  }

  get isAuthenticated(): boolean {
    // Check if the Angular app thinks this user is authenticated
    return JSON.parse(localStorage.getItem(this.authFlag));
  }

  setToken(token: string) {
    this.accessToken = token;
    this.accessToken$.next(token);
  }

  navigateAfterParseHash() {
    const rd = localStorage.getItem(this.redirect);
    if (rd) {
      this.router.navigateByUrl(rd).then(
        navigated => {
          if (navigated) {
            this.hideAuthHeader = false;
          }
          this.clearRedirect();
        }
      );
    } else {
      this.clearRedirect();
      this.router.navigateByUrl(this.defaultSuccessPath);
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
