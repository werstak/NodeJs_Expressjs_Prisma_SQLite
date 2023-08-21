import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // STATE
  fetchUsers(): Observable<any> {
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

  // STATE
  updateUser1(id: number, params: any, avatar: any, imageOrUrl: any, previousImageUrl: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append("ProfilePicture", avatar);
    uploadData.append("user_params", JSON.stringify(params));
    uploadData.append("imageOrUrl", JSON.stringify(imageOrUrl));
    uploadData.append("previousImageUrl", JSON.stringify(previousImageUrl));
    return this.http.put(config.API_URL + `/users/` + id, uploadData);
  }


  updateUser(id: number, params: any, avatar: any, imageOrUrl: any, previousImageUrl: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append("ProfilePicture", avatar);
    uploadData.append("user_params", JSON.stringify(params));
    uploadData.append("imageOrUrl", JSON.stringify(imageOrUrl));
    uploadData.append("previousImageUrl", JSON.stringify(previousImageUrl));
    return this.http.put(config.API_URL + `/users/` + id, uploadData);
  }


  addUser(params: UserModel, avatar: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append("ProfilePicture", avatar);
    uploadData.append("user_params", JSON.stringify(params));
    return this.http.post(config.API_URL + `/users/`, uploadData);
  }


  removeUser(id: number, params: any): Observable<any> {
    return this.http.delete(config.API_URL + `/users/` + id, {params});
  }
}
