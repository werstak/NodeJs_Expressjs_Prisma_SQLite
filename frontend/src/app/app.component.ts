import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from './modules/auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from './core/models/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  account?: Auth | null;

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
    // this.authService.account.subscribe(x => this.account = x);
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  ngOnInit() {
    this.isAth();
  }

  private isAth() {
    this.authService.account.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.account = resp;
        if (!this.account) {
          this.router.navigate(['auth/login']);
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
