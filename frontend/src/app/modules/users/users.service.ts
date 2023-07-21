import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import * as config from "../../../app-config";


@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(
    private http: HttpClient,
  ) { }


  getAllUsers(): Observable<any> {
    return this.http.get(config.API_URL + `/users`)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }



}
