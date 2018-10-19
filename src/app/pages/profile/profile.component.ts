import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  user$ = this.auth.userProfile$.pipe(
    catchError(
      err => throwError(err)
    ),
    tap(
      user => this.loading = false,
      err => {
        this.loading = false;
        this.error = true;
      }
    )
  );
  loading = true;
  error: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  makeArray(obj): string[] {
    const keyPropArray = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        keyPropArray.push(key + ': ' + JSON.stringify(obj[key]));
      }
    }
    return keyPropArray;
  }

}
