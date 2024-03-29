import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { UserModel } from '../../core/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as config from '../../../app-config';
import { UserParamsModel } from '../../core/models/user-params.model';
import { CategoriesModel } from '../../core/models/categories.model';
import { LoginUser } from '../../core/models/login-user';
import { map } from 'rxjs/operators';


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
  usersFilters$ = new BehaviorSubject<any>({});


  fetchUsers(params: UserParamsModel): Observable<any> {
    return this.http.get(config.API_URL + `/users`, {
      params: new HttpParams()
        .set('orderByColumn', params.orderByColumn)
        .set('orderByDirection', params.orderByDirection)
        .set('pageIndex', params.pageIndex)
        .set('pageSize', params.pageSize)
        .set('firstName', params.firstName)
        .set('lastName', params.lastName)
        .set('email', params.email)
        .set('roles', JSON.stringify(params.roles))
    })
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

  updateUser(id: number, params: UserModel, avatar: any, imageOrUrl: boolean, previousImageUrl: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', avatar);
    uploadData.append('user_params', JSON.stringify(params));
    uploadData.append('imageOrUrl', JSON.stringify(imageOrUrl));
    uploadData.append('previousImageUrl', JSON.stringify(previousImageUrl));
    return this.http.put(config.API_URL + `/users/` + id, uploadData);
  }


  updateUserPassword(id: number, params: any): Observable<any> {
    return this.http.put(config.API_URL + `/users/update_password/` + id, params);
  }

  // updatePasswordUser(id: number, password: string): Observable<any> {
  //   return this.http.put(config.API_URL + `/users/update_password`);
  //     .pipe(
  //       catchError(error => {
  //         console.log('Error: ', error.message);
  //         return throwError(error);
  //       })
  //     );
  // }

  addUser(params: UserModel, avatar: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', avatar);
    uploadData.append('user_params', JSON.stringify(params));
    return this.http.post(config.API_URL + `/users/`, uploadData);
  }

  removeUser(id: number, params: any): Observable<any> {
    return this.http.delete(config.API_URL + `/users/` + id, {params});
  }

}
