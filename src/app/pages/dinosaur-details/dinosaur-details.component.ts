import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IDinoDetails } from '../../data/dino.interface';
import { ApiService } from './../../data/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dinosaur-details',
  templateUrl: './dinosaur-details.component.html',
  styles: []
})
export class DinosaurDetailsComponent implements OnInit, OnDestroy {
  name: string;
  params$ = this.route.params.pipe(
    tap(
      params => this.dinoSetup(params['name']),
      err => this.handleErr('No dinosaur found.')
    )
  );
  loading = true;
  error: boolean;
  errorMsg: string;
  dinoSub: Subscription;
  dino: IDinoDetails;
  toggleFavSub: Subscription;
  savingFav: boolean;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  private dinoSetup(nameParam: string) {
    this.dinoSub = this.api.getDinoByName$(nameParam).subscribe(
      dino => {
        if (dino) {
          this.title.setTitle(dino.name);
          this.loading = false;
          this.dino = dino;
        } else {
          this.handleErr('The dinosaur you requested could not be found.');
        }
      },
      err => this.handleErr()
    );
  }

  private handleErr(msg?: string) {
    this.error = true;
    this.loading = false;
    if (msg) {
      this.errorMsg = msg;
    }
  }

  toggleFav() {
    this.savingFav = true;
    this.toggleFavSub = this.api.favDino$(this.dino.name).subscribe(
      dino => {
        this.dino = dino;
        this.savingFav = false;
      }
    );
  }

  get getFavBtnText() {
    if (this.savingFav) {
      return 'Saving...';
    }
    return !this.dino.favorite ? 'Favorite' : 'Un-favorite';
  }

  ngOnDestroy() {
    if (this.toggleFavSub) {
      this.toggleFavSub.unsubscribe();
    }
    this.dinoSub.unsubscribe();
  }

}
