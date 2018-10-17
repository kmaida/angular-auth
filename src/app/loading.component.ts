import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="text-center my-3">
      <img src="/assets/images/loading.svg" alt="Loading...">
    </div>
  `,
  styles: []
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
