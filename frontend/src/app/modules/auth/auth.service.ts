import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as config from '../../../app-config';
import { map } from 'rxjs/operators';
import { LoginUser } from '../../core/models/login-user';
import { RegisterUser } from '../../core/models/register-user';
import { Auth } from '../../core/models/auth';
import { PasswordResetTokenModel } from '../../core/models/password-reset-token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accountSubject$ = new BehaviorSubject<Auth | null>(null);
  readonly JWT_ACCESS_TOKEN_KEY = 'access_token';
  readonly JWT_REFRESH_TOKEN_KEY = 'refresh_token';
  readonly ACCOUNT = 'account';

  private refreshTokenTimeout?: number;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  public get accountValue() {
    return this.accountSubject$.value;
  }

  /**
   New User Registration
   */
  register(registerUserData: RegisterUser) {
    console.log('AuthService = REGISTER()', registerUserData)
    return this.http.post<any>(config.API_URL + `/auth/register/`, {registerUserData})
      .pipe(map(account => {
        const {accessToken, refreshToken} = account
        this.setTokens(accessToken, refreshToken);
        return account;
      }));
  }

  /**
   User authorization
   */
  login(loginUserData: LoginUser) {
    // console.log('LOGIN() AuthService', loginUserData);
    return this.http.post<any>(config.API_URL + `/auth/login/`, {loginUserData})
      .pipe(map(account => {
        const {accessToken, refreshToken, userInfo} = account
        this.setTokens(accessToken, refreshToken);
        this.setUser(userInfo);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  /**
   saving user data and tokens in Localstorage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.JWT_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.JWT_REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(userInfo: any): void {
    localStorage.setItem(this.ACCOUNT, JSON.stringify(userInfo));
    this.getAccountLocalStorage();
  }

  /**
   Get user account data from Localstorage and write to Stream - this.accountSubject$
   */
  public getAccountLocalStorage() {
    const userInfo = localStorage.getItem('account');
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (userInfo != null && refreshToken != null && accessToken != null) {
      const userInfoPars = JSON.parse(userInfo);
      const account = {
        userInfo: userInfoPars,
        refreshToken: refreshToken,
        accessToken: accessToken
      }
      this.accountSubject$.next(account);
    } else {
      console.log('NOT AUTHORIZED');
      return;
    }
  }

  /**
   Token refresh request (accessToken, refreshToken)
   */
  private refreshToken() {
    const refreshToken = this.accountValue!.refreshToken
    return this.http.post<any>(config.API_URL + `/auth/refreshToken`, {refreshToken})
      .pipe(map((tokens) => {

        console.log('RESPONSE refreshToken');
        const {accessToken, refreshToken} = tokens
        this.setTokens(accessToken, refreshToken);
        this.getAccountLocalStorage();
        this.startRefreshTokenTimer();
        return tokens;
      }));
  }

  /**
   User logout
   */
  logout() {
    const refreshToken = this.accountValue!.refreshToken;
    this.http.post<any>(config.API_URL + `/auth/revokeRefreshTokens`, {refreshToken}).subscribe();
    this.stopRefreshTokenTimer();
    this.accountSubject$.next(null);
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('account');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    // localStorage.clear();
    console.log('!!! LOGOUT')
  }

  /**
   Start refresh tokens Timer (accessToken, refreshToken)
   */
  private startRefreshTokenTimer() {
    const jwtBase64 = this.accountValue!.accessToken!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // SET A TIMEOUT TO REFRESH THE TOKEN A MINUTE BEFORE IT EXPIRES
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  /**
   Stop RefreshTokenTimer
   */
  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  /**
   This request is executed to check whether the user has such a password before launching the password replacement function
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


  getVerifyEmail(verifyEmail: string) {
    console.log('UsersService = verifyEmail()', verifyEmail);
    return this.http.post(config.API_URL + `/auth/verify_email/`, {verifyEmail})
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }


  getValidPasswordResetToken(passwordResetToken: PasswordResetTokenModel) {
    console.log('UsersService = getValidPasswordResetToken()', passwordResetToken);
    return this.http.post(config.API_URL + `/auth/reset_password_link/`, {passwordResetToken})
      .pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      );
  }


}
