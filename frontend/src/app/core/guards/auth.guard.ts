import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../../modules/auth/auth.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const account = this.authService.accountValue;
    // let account;

    // this.authService.account.pipe(
    //   takeUntil(this.destroy))
    //   .subscribe(resp => {
    //     account = resp;
    //   });


    console.log(111111, 'AuthGuard', account)


    if (account) {
      // check if route is restricted by role
      // if (route.data.roles && !route.data.roles.includes(account.role)) {
      //   // role not authorized so redirect to home page
      //   this.router.navigate(['/']);
      //   return false;
      // }

      // authorized so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
