import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import * as config from '../../../app-config';
import { UserModel } from '../../shared/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
  }

  users$ = new BehaviorSubject<any>([]);


  getAllUsers(): Observable<any> {
    return this.http.get(config.API_URL + `/users`)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }

  getUser(id: number): Observable<any> {
    return this.http.get(config.API_URL + `/users/` + id)
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }


  updateUser(id: number, params: any, avatar: any, imageOrUrl: any, previousImageUrl: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append("ProfilePicture", avatar);
    uploadData.append("user_params", JSON.stringify(params));
    uploadData.append("imageOrUrl", JSON.stringify(imageOrUrl));
    uploadData.append("previousImageUrl", JSON.stringify(previousImageUrl));

    console.log('params', params);
    console.log('uploadData', uploadData);

    return this.http.put(config.API_URL + `/users/` + id, uploadData);
  }


  addUser(params: UserModel, avatar: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append("ProfilePicture", avatar);
    uploadData.append("user_params", JSON.stringify(params));

    console.log('ADD params', params);
    console.log('ADD uploadData', uploadData);
    return this.http.post(config.API_URL + `/users/`, uploadData);
  }


  //
  // addUser(params: UserModel): Observable<any> {
  //   return this.http.post(config.API_URL + `/users/`, params);
  // }

  removeUser(id: number, params: any): Observable<any> {
    return this.http.delete(config.API_URL + `/users/` + id, {params});
  }


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
