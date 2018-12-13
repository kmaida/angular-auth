import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { IDino } from './dino.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRoot = '/api/';

  constructor(private http: HttpClient) { }

  getDinos$(): Observable<IDino[]> {
    return this.http
      .get<IDino[]>(`${this.apiRoot}dinosaurs`)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  getDinoByName$(name: string): Observable<IDino> {
    return this.http
      .get<IDino>(`${this.apiRoot}secure/dinosaur/${name}`)
      .pipe(
        catchError(err => throwError(err))
      );
  }
}
