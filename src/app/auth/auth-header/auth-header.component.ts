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

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
