import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../data/api.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dinosaurs',
  templateUrl: './dinosaurs.component.html',
  styles: []
})
export class DinosaursComponent implements OnInit {
  dinos$ = this.api.getDinos$().pipe(
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
  pageTitle = 'Dinosaurs';

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
