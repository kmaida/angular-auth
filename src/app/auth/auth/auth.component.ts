import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  user$ = this.auth.userProfile$.pipe(catchError(err => throwError(err)));

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
