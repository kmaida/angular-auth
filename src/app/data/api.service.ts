import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { IDino, IDinoDetails } from './dino.interface';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getDinos$(): Observable<IDino[]> {
    return this.http
      .get<IDino[]>(`${environment.api.baseUrl}dinosaurs`)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  getDinoByName$(name: string): Observable<IDinoDetails> {
    return this.http
      .get<IDinoDetails>(`${environment.api.baseUrl}secure/dinosaur/${name}`)
      .pipe(
        catchError(err => throwError(err))
      );
  }
}
