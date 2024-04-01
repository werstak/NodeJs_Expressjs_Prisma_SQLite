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

  public get accountValue1() {
    return this.accountSubject.value;
  }


  register(registerUserData: RegisterUser) {
    console.log('AuthService = REGISTER()', registerUserData)
    return this.http.post<any>(config.API_URL + `/auth/register/`, {registerUserData})
      .pipe(map(account => {
        const {accessToken, refreshToken} = account
        this.setTokens(accessToken, refreshToken);
        return account;
      }));
  }


  login(loginUserData: LoginUser) {
    // console.log('LOGIN() AuthService', loginUserData);
    // const refreshToken = this.accountValue1;
    // const refreshToken = localStorage.getItem('refresh_token');
    // console.log(55555555555555, refreshToken)
    return this.http.post<any>(config.API_URL + `/auth/login/`, {loginUserData})
      .pipe(map(account => {

        console.log('login() RESP = ', account)
        const {accessToken, refreshToken, userInfo} = account

        this.setTokens(accessToken, refreshToken);
        this.setUser(userInfo);

        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.JWT_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.JWT_REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(userInfo: any): void {
    localStorage.setItem(this.ACCOUNT, JSON.stringify(userInfo));
    // this.getAccountLocalStorage();
  }


  getAccountLocalStorage() {
    const userInfo = localStorage.getItem('account');
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (userInfo != null && refreshToken != null && accessToken != null ) {
      const userInfoPars = JSON.parse(userInfo);
      const account = {
        userInfo: userInfoPars,
        refreshToken: refreshToken,
        accessToken: accessToken
      }

      console.log(456, account)
      this.accountSubject.next(account);
      this.account = this.accountSubject.asObservable();
    } else {
      console.log('Not authorized - getAccountLocalStorage()');
      return;
    }
  }

  // getAccountLocalStorage() {
  //   const account = localStorage.getItem('account');
  //   console.log(333, 'getAccountLocalStorage', account)
  //   if (account != null) {
  //     const accountPars = JSON.parse(account);
  //
  //     console.log(333, 'accountPars', accountPars)
  //
  //     this.accountSubject.next(accountPars);
  //     this.account = this.accountSubject.asObservable();
  //   }
  // }




  refreshToken() {
    const refreshToken = this.accountValue1!.refreshToken
    console.log(22222, 'refreshToken()')
    return this.http.post<any>(config.API_URL + `/auth/refreshToken`, {refreshToken})
      .pipe(map((account) => {

        const {accessToken, refreshToken, userInfo} = account
        this.setTokens(accessToken, refreshToken);
        this.setUser(userInfo);

        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }


  logout() {
    const refreshToken = this.accountValue1!.refreshToken;
    this.http.post<any>(config.API_URL + `/auth/revokeRefreshTokens`, {refreshToken}).subscribe();
    this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('account');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    // localStorage.clear();
    console.log('!!! Logout')
  }


  private refreshTokenTimeout?: any;

  private startRefreshTokenTimer() {
    // console.log(11111, 'startRefreshTokenTimer')
    // parse json object from base64 encoded jwt token
    const jwtBase64 = this.accountValue1!.accessToken!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));
    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    console.log(555, expires)
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    console.log(555, timeout)

    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  /**
   this request is executed to check whether the user has such a password before launching the password replacement function
   */
  getValidPassword(validPasswordData: LoginUser) {
    console.log('UsersService = getValidPassword()', validPasswordData);
    return this.http.post(config.API_URL + `/auth/valid_password/`, {validPasswordData})
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }


}
