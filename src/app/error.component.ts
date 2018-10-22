import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <p class="alert alert-danger">
      <strong>Oops!</strong>
      <ng-template #defaultError>
        Something went wrong! Please try again.
      </ng-template>
      <ng-container *ngIf="authError else defaultError">
        Authentication did not succeed. Please try again, or log in using a different method.
      </ng-container>
    </p>
  `,
  styles: []
})
export class ErrorComponent implements OnInit {
  @Input() authError: boolean;

  constructor() { }

  ngOnInit() {
  }

}
