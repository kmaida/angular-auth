import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <p class="alert alert-danger">
      <strong class="pr-1">Oops!</strong>
      <ng-container *ngIf="errorMsg else defaultErr">{{ errorMsg }}</ng-container>
      <ng-template #defaultErr>Something went wrong! Please try again.</ng-template>
    </p>
  `,
  styles: []
})
export class ErrorComponent implements OnInit {
  @Input() errorMsg: string;

  constructor() { }

  ngOnInit() {
  }

}
