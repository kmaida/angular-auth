import { Component, OnInit, Input } from '@angular/core';
import { IDino } from '../../../data/models/dino.interface';

@Component({
  selector: 'app-dino',
  templateUrl: './dino.component.html',
  styles: []
})
export class DinoComponent implements OnInit {
  @Input() dino: IDino;

  constructor() { }

  ngOnInit() {
  }

}
