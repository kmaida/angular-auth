import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {
  dragons$ = this.api.getDragons$().pipe(
    tap(
      res => this.loading = false,
      err => {
        this.loading = false;
        this.error = true;
        console.log(err);
      }
    )
  );
  loading: boolean;
  error: boolean;

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
  }

}
