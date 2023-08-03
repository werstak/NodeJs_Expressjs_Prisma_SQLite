import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import * as config from "../../../app-config";
import { UserModel } from '../../shared/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }


  getAllUsers(): Observable<any> {
    return this.http.get(config.API_URL + `/users`)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );

  // .pipe(
  //     catchError(this.handleError.bind(this))
  //   );
  }

  getUser(id: number): Observable<any> {
    return this.http.get(config.API_URL + `/users/`+ id)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  updateUser(id: number, params: UserModel): Observable<any> {
    return this.http.put(config.API_URL + `/users/`+ id, params);
      // .pipe(
      //   catchError(error => {
      //     console.log('Error: ', error.message);
      //     return throwError(error);
      //   })
      // );

  // .pipe(
  //     catchError(this.handleError.bind(this))
  //   );
  }

  // updateMetadata(_id: string, metadata: any): Observable<any> {
  //   return this.httpClient.patch(`${environment.API_URL}client/updateMetadata`, {metadata, _id})
  //     .pipe(
  //       catchError(this.handleError.bind(this))
  //     );
  // }


  // update(id: string, params: any) {
  //   return this.http.put(`${baseUrl}/${id}`, params)
  //     .pipe(map((account: any) => {
  //       // update the current account if it was updated
  //       if (account.id === this.accountValue?.id) {
  //         // publish updated account to subscribers
  //         account = { ...this.accountValue, ...account };
  //         this.accountSubject.next(account);
  //       }
  //       return account;
  //     }));
  // }


  private handleError(errorResponse: HttpErrorResponse | any) {
    const messageStr = errorResponse.error.message;
    console.log(messageStr);
    if (typeof messageStr === 'string') {
      this._snackBar.open(`Error message: ${messageStr}`, 'ok', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 4000,
      });
    } else if (Array.isArray(messageStr)) {
      const messageObj = Object.values(errorResponse.error.message[0].constraints);
      const messageObjProp = errorResponse.error.message[0].property;
      console.log(messageObj);
      console.log(messageObjProp);
      this._snackBar.open(`Error message: ${messageObj} - ${messageObjProp}`, 'ok', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 4000,
      });
    } else {
      this._snackBar.open(`Error message: something wrong happened`, 'ok', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 4000,
      });
    }
    return throwError(errorResponse);
  }

}
