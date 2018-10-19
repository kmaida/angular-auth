import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styles: [`
    img {
      border-radius: 100px;
      height: 30px;
      width: 30px;
    }
    .active { font-weight: bold; }
  `]
})
export class AuthHeaderComponent implements OnInit {
  authStatusSub: Subscription;
  routeSub: Subscription;
  hideAuthHeader: boolean;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Simply log authentication status
    this.authStatusSub = this.auth.authStatus$.subscribe(
      status => console.log(status),
      err => console.log(err)
    );

    // Don't show the small header login button on the login page
    // This page has its own large CTA version of the button
    this.routeSub = this.router.events.subscribe(
      data => {
        if (data instanceof NavigationEnd) {
          this.hideAuthHeader = data.url === '/login';
        }
      }
    );
  }

}
