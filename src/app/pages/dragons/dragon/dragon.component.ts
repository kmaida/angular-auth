import { Component, OnInit, Input } from '@angular/core';
import { IDragon } from '../../../data/models/dragon.interface';

@Component({
  selector: 'app-dragon',
  templateUrl: './dragon.component.html',
  styles: []
})
export class DragonComponent implements OnInit {
  @Input() dragon: IDragon;

  constructor() { }

  ngOnInit() {
  }

}
