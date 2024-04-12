import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth.service';
import { AppRouteEnum } from '../../../../core/enums';
import { EMAIL_VALIDATION_PATTERN } from '../../../../shared/validation-patterns/pattern-email';
import { NotificationService } from '../../../../shared/notification.service';
import { ResponseMessageModel } from '../../../../core/models/response-message.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
  }

  private verifyCurrentEmail: any;

  AppRouteEnum = AppRouteEnum;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;
  recoveryForm: FormGroup;
  hide = true;


  ngOnInit() {
    this.buildRecoveryForm();
  }

  private buildRecoveryForm() {
    this.recoveryForm = this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_VALIDATION_PATTERN),
        Validators.maxLength(100)])
      ]
    });
  }

  onSubmitRecovery(): void {
    if (this.recoveryForm.valid) {
      this.dataLoading = true;
      const verifyEmail = this.recoveryForm.value;

      console.log('verifyEmail', verifyEmail)

      this.authService.getVerifyEmail(verifyEmail).pipe(
        takeUntil(this.destroy))
        .subscribe((resp) => {
            console.log('resp', resp);
            this.dataLoading = false;
          let test: ResponseMessageModel;
            if (resp) {
              this.verifyCurrentEmail = resp;

              test = this.verifyCurrentEmail.message;

            } else {
              this.verifyCurrentEmail = resp;
            }

            // test = this.verifyCurrentEmail;
            this.notificationService.showSuccess(this.verifyCurrentEmail.message);
            // this.notificationService.showSuccess('Password reset link sent to your email account');
          },
          (error) => {
            this.dataLoading = false;
            console.error(error);
            // const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
            // const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);

            this.notificationService.showError(error);
          });

      // this.dataLoading = false;
    } else {
      return;
    }
  }


  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
