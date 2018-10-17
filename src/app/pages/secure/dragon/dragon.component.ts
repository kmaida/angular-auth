import { Component, OnInit, Input } from '@angular/core';
import { IDragon } from 'src/app/dragon.model';

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