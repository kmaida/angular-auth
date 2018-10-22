import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { IDragon } from './models/dragon.model';
import { IDino } from './models/dino.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _ApiRoot = '/api/';

  constructor(private http: HttpClient) { }

  getDinos$(): Observable<any[]> {
    return this.http
      .get<IDino[]>(`${this._ApiRoot}public`)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  getDragons$(): Observable<any[]> {
    return this.http
      .get<IDragon[]>(`${this._ApiRoot}secure`)
      .pipe(
        catchError(err => throwError(err))
      );
  }
}
