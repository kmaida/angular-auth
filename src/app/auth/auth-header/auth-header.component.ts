import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

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

  constructor(public auth: AuthService) { }

  ngOnInit() {
    // Simply log authentication status
    this.authStatusSub = this.auth.authStatus$.subscribe(
      status => console.log(status),
      err => console.log(err)
    );
  }

}
