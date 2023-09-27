import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // if (this.authService.accountValue) {
    //   this.router.navigate(['/']);
    // }
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  public account?: boolean;


  ngOnInit() {
    this.getAccount();
  }

  private getAccount() {
    this.authService.account$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.account = resp;
        if (this.account) {
          this.router.navigate(['/']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
