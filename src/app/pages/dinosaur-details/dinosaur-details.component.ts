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
      params => {
        this.name = params['name'];
        this.dinoSetup();
      }
    )
  );
  dino$: Observable<IDino>;
  loading = true;
  error: boolean;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  private dinoSetup() {
    this.dino$ = this.api.getDinoByName$(this.name).pipe(
      tap(
        dino => {
          this.title.setTitle(dino.name);
          this.loading = false;
        },
        err => {
          this.error = true;
          this.loading = false;
          this.title.setTitle('Dinosaur');
        }
      )
    );
  }

}
