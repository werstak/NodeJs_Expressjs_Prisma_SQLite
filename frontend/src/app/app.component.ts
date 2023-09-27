import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Account } from './core/models/account';
import { AuthService } from './modules/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // title = 'frontend';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
  ) {
    // this.authService.account$.subscribe(x => this.account = x);
    // const account = this.authService.accountValue;
    // this.account = true;
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
        console.log(2222222, 'AppComponent', this.account)
      });
  }



  logout(): void {
    this.authService.account$.next(false);
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
