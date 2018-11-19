import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IDino } from './../../data/models/dino.interface';
import { ApiService } from './../../data/api.service';

@Component({
  selector: 'app-dinosaur-details',
  templateUrl: './dinosaur-details.component.html',
  styleUrls: ['./dinosaur-details.component.css']
})
export class DinosaurDetailsComponent implements OnInit {
  name: string;
  params$ = this.route.params.pipe(
    tap(
      params => this.dinoSetup(params['name'])
    )
  );
  dino$: Observable<IDino>;
  loading = true;
  error: boolean;
  errorMsg: string;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  private dinoSetup(nameParam: string) {
    this.dino$ = this.api.getDinoByName$(nameParam).pipe(
      tap(
        dino => {
          if (dino) {
            this.title.setTitle(dino.name);
            this.loading = false;
          } else {
            this.handleErr('The dinosaur you requested could not be found.');
          }
        },
        err => this.handleErr()
      )
    );
  }

  private handleErr(msg?: string) {
    this.error = true;
    this.loading = false;
    if (msg) {
      this.errorMsg = msg;
    }
  }

}
