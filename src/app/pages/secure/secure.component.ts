import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {
  dragons$ = this.api.getDragons$;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

}
