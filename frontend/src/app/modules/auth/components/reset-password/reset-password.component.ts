import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PasswordResetTokenModel } from '../../../../core/models/password-reset-token.model';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  // private accessPageAllowed: Auth | null;
  private accessPageAllowed: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
  ) {
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;
  resetForm: FormGroup;
  hide = true;
  resetTokenFromQueryParams: PasswordResetTokenModel;
  private urlParams: ActivatedRouteSnapshot;

  ngOnInit() {
    this.getUrlParams();
  }

  private getUrlParams() {
    this.urlParams = this.activatedRoute.snapshot;
    console.log(222, this.urlParams)
    this.accessCurrentPageHandler();
  }


  private accessCurrentPageHandler() {
    const {id, token} = this.urlParams.queryParams;
    this.resetTokenFromQueryParams = {id, token}
    console.log(1, 'INPUT this.resetTokenFromQueryParams', this.resetTokenFromQueryParams)

    this.authService.getValidPasswordResetToken(this.resetTokenFromQueryParams).pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
          if (resp) {
            console.log(12, 'getValidPasswordResetToken()', resp)
            this.accessPageAllowed = resp;
            this.authService.validResetToken$.next(true);

            this.notificationService.showSuccess(this.accessPageAllowed.message);
          }
        },
        (error) => {
          this.authService.validResetToken$.next(false);
          console.error(error);
          this.notificationService.showError(error);
          this.router.navigate(['auth/forgot-password']);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }


}
