import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../api.service';
import { AuthService } from './../../auth/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dragons',
  templateUrl: './dragons.component.html',
  styles: []
})
export class DragonsComponent implements OnInit {
  dragons$ = this.api.getDragons$().pipe(
    tap(
      res => this.loading = false,
      err => {
        this.loading = false;
        this.error = true;
      }
    )
  );
  loading = true;
  error: boolean;

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

}
