import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../../core/models/account';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as config from '../../../app-config';
import { map } from 'rxjs/operators';

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


  // login(email: string, password: string) {
  //   return this.http.post<any>(config.API_URL + `/authenticate/`, {email, password}, {withCredentials: true})
  //     .pipe(map(account => {
  //       this.accountSubject.next(account);
  //       this.startRefreshTokenTimer();
  //       return account;
  //     }));
  // }


}
