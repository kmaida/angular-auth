import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {
  dragons$ = this.api.getDragons$();

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

}
