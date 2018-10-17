import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _ApiRoot = '/api/';

  constructor(private http: HttpClient) { }

  getDinos$(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this._ApiRoot}public`)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  getDragons$(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this._ApiRoot}secure`)
      .pipe(
        catchError(err => throwError(err))
      );
  }
}
