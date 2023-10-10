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
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  public account?: boolean;


  ngOnInit() {
    this.getAccount();
  }

  private getAccount() {

    if (this.authService.accountValue1) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
