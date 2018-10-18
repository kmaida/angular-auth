import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { throwError, Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: [`
    img {
      border-radius: 100px;
      display: inline-block;
      height: 30px;
      width: 30px;
    }
    .active { font-weight: bold; }
  `]
})
export class AuthComponent implements OnInit {
  authStatusSub: Subscription;
  routeSub: Subscription;
  onLoginPage: boolean;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authStatusSub = this.auth.authStatus$.subscribe(
      status => console.log(status),
      err => console.log(err)
    );

    this.routeSub = this.router.events.subscribe(
      data => {
        if (data instanceof NavigationEnd) {
          this.onLoginPage = data.url === '/login';
        }
      }
    );
  }

}
