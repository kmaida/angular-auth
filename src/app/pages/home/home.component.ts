import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../api.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dinos$ = this.api.getDinos$();

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

}
