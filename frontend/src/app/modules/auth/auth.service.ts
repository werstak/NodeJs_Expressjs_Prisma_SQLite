import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Account } from '../../core/models/account';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as config from '../../../app-config';
import { map } from 'rxjs/operators';
import { LoginUser } from '../../core/models/login-user';
import { RegisterUser } from '../../core/models/register-user';
import { Auth } from '../../core/models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accountSubject: BehaviorSubject<Auth | null>;
  public account: Observable<Auth | null>;

  readonly JWT_ACCESS_TOKEN_KEY = 'access_token';
  readonly JWT_REFRESH_TOKEN_KEY = 'refresh_token';
  readonly ACCOUNT = 'account';



  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.accountSubject = new BehaviorSubject<Auth | null>(null);
    this.account = this.accountSubject.asObservable();
  }

  public account$ = new BehaviorSubject<boolean>(false);

  public get accountValue() {
    return this.account$.value;
  }

  public get accountValue1() {
    return this.accountSubject.value;
  }



  /*
    login(email: string, password: string)
  */
//
// {
//   "id": 1,
//   "title": "Mr",
//   "firstName": "Andrey",
//   "lastName": "Petr",
//   "email": "webproger1@gmail.com",
//   "role": "Admin",
//   "dateCreated": "2023-10-09T06:18:23.935Z",
//   "isVerified": true,
//   "jwtToken": "fake-jwt-token.eyJleHAiOjE2OTY4MzMzNTQsImlkIjoxfQ=="
// }
//


/*
  function authenticate()
*/
// {
//   "title": "Mr",
//   "firstName": "Andrey",
//   "lastName": "Petr",
//   "email": "webproger1@gmail.com",
//   "password": "123456",
//   "acceptTerms": true,
//   "id": 1,
//   "role": "Admin",
//   "dateCreated": "2023-10-09T06:18:23.935Z",
//   "verificationToken": "1696832303935",
//   "isVerified": true,
//   "refreshTokens": [
//     "1696832454228"
//   ]
// }

  login(loginUserData: LoginUser) {
    console.log('AuthService = LOGIN()', loginUserData)
    return this.http.post<any>(config.API_URL + `/auth/login/`, {loginUserData})
      .pipe(map(account => {

        // console.log('login() RESP = ', account)

        const {accessToken, refreshToken, userInfo} = account
        this.setTokens(accessToken, refreshToken, userInfo);

        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  private setTokens(accessToken: string, refreshToken: string, userInfo: any): void {
    localStorage.setItem(this.ACCOUNT, JSON.stringify(userInfo));
    localStorage.setItem(this.JWT_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.JWT_REFRESH_TOKEN_KEY, refreshToken);

  }

  refreshToken() {
    const refreshToken = this.accountValue1!.refreshToken
    console.log(22222, 'refreshToken()')
    return this.http.post<any>(config.API_URL + `/auth/refreshToken`, {refreshToken})
      .pipe(map((account) => {

        const {accessToken, refreshToken, userInfo} = account
        this.setTokens(accessToken, refreshToken, userInfo);

        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
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



/*
  localStorage.setItem
*/
// {
//   "title": "Mr",
//   "firstName": "webproger1@gmail.com",
//   "lastName": "Petr",
//   "email": "webproger1@gmail.com",
//   "password": "123456",
//   "acceptTerms": true,
//   "id": 1,
//   "role": "Admin",
//   "dateCreated": "2023-10-09T07:56:43.691Z",
//   "verificationToken": "1696838203691",
//   "isVerified": false,
//   "refreshTokens": []
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

  logout() {
    const userId = this.accountValue1!.userInfo.id
    this.http.post<any>(config.API_URL + `/auth/revokeRefreshTokens`, {userId}).subscribe();

    // this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
    // this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigate(['/auth/login/']);
    // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }


  private refreshTokenTimeout?: any;

  private startRefreshTokenTimer() {
    console.log(11111, 'startRefreshTokenTimer')
    // parse json object from base64 encoded jwt token
    const jwtBase64 = this.accountValue1!.accessToken!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }


}
