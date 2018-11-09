import { Component, OnInit, Input } from '@angular/core';
import { IDino } from './../../../data/models/dino.interface';
import { AuthService } from './../../../auth/auth.service';

@Component({
  selector: 'app-dino',
  templateUrl: './dino.component.html',
  styles: []
})
export class DinoComponent implements OnInit {
  @Input() dino: IDino;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
