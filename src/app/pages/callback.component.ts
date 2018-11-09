import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <app-loading></app-loading>
  `,
  styles: []
})
export class CallbackComponent implements OnInit {

  constructor(
    private title: Title,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.title.setTitle('Angular Authentication with Auth0');
    this.auth.handleLoginCallback();
  }

}
