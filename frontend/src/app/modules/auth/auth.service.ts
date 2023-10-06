import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Account } from '../../core/models/account';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as config from '../../../app-config';
import { map } from 'rxjs/operators';
import { LoginUser } from '../../core/models/login-user';
import { RegisterUser } from '../../core/models/register-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private accountSubject: BehaviorSubject<boolean>;
  // public account: Observable<boolean>;


  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // this.accountSubject = new BehaviorSubject<boolean>(false);
    // this.account = this.accountSubject.asObservable();
  }

  public account$ = new BehaviorSubject<boolean>(false);

  public get accountValue() {
    return this.account$.value;
  }


//
// {
//   "id": 1,
//   "title": "Mr",
//   "firstName": "Andrey",
//   "lastName": "Petr",
//   "email": "webproger1@gmail.com",
//   "role": "Admin",
//   "dateCreated": "2023-10-06T14:00:59.004Z",
//   "isVerified": true,
//   "jwtToken": "fake-jwt-token.eyJleHAiOjE2OTY2MDcwNTMsImlkIjoxfQ=="
// }
//

  login(loginUserData: LoginUser) {
    console.log('AuthService = LOGIN()', loginUserData)
    return this.http.post<any>(config.API_URL + `/auth/login/`, {loginUserData})
      .pipe(map(account => {
        console.log('login RESP = ', account)

        // this.accountSubject.next(account);
        // this.startRefreshTokenTimer();
        return account;
      }));
  }


  // login(loginUserData: LoginUser): Observable<any> {
  //   return this.http.post<any>(config.API_URL + `/auth/login/`, {loginUserData})
  //     .pipe(
  //       catchError(error => {
  //         console.log('Error: ', error.message);
  //         return throwError(error);
  //       })
  //     );
  // }

  register(registerUserData: RegisterUser) {
    console.log('AuthService = REGISTER()', registerUserData)
    return this.http.post<any>(config.API_URL + `/auth/register/`, {registerUserData})
      .pipe(map(account => {
        // this.accountSubject.next(account);
        // this.startRefreshTokenTimer();
        return account;
      }));
  }


}
