import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../../modules/auth/auth.service';
import { ReplaySubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const account = this.authService.accountValue;

    if (account) {
      // CHECK IF ROUTE IS RESTRICTED BY ROLE

      // if (route.data.roles && !route.data.roles.includes(account.role)) {
      //   // role not authorized so redirect to home page
      //   this.router.navigate(['/']);
      //   return false;
      // }

      // authorized so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }
}
