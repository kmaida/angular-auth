import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../data/api.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
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
  pageTitle = 'Welcome';

  constructor(
    private title: Title,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
