import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  authError$: Observable<boolean> = this.auth.authStatus$.pipe(
    filter(event => event === 'login_error' || event === 'login_success'),
    map(
      event => !!(event === 'login_error')
    )
  );

  constructor(public auth: AuthService) {}

  ngOnInit() {
    // If the app believes there is an active session
    // on Auth0 authorization server, attempt to renew auth
    this.auth.renewAuth();
  }
}
