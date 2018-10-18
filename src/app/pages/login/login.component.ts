import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
    // If there's no secure route we should
    // redirect to after login, just go
    // back to the default public route
    if (!this.auth.redirectAfterLogin) {
      this.auth.setRedirect(this.auth.logoutUrl);
    }
  }

}
