import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public auth: AuthService) {}

  ngOnInit() {
    // If the app believes there is an active session
    // on Auth0 authorization server, attempt to renew auth
    this.auth.renewAuth();
  }
}
