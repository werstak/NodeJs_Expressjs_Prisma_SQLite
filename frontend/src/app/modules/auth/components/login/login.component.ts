import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../../../shared/notification.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRouteEnum } from '../../../../core/enums';
import { EMAIL_VALIDATION_PATTERN } from '../../../../shared/validation-patterns/pattern-email';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
  ) {
  }

  AppRouteEnum = AppRouteEnum;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;
  authForm: FormGroup;
  hide = true;


  private loginResp: any;


  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.authForm = this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_VALIDATION_PATTERN),
        Validators.maxLength(100)])
      ],
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ]
    });
  }


  /**
   Routing to the first page after logging in
   */
  onSubmitAuth(): void {
    this.dataLoading = true;

    if (this.authForm.valid) {
      const loginUserData = this.authForm.value;

      this.authService.login(loginUserData).pipe(
        takeUntil(this.destroy))
        .subscribe(resp => {
            this.loginResp = resp;
            if (resp) {
              this.dataLoading = false;
              // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
              // this.router.navigateByUrl(returnUrl);
              this.router.navigate(['/' + AppRouteEnum.Users]);
            }
          },
          (error) => {
            this.dataLoading = false;
            console.error(error);
            // const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
            // const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);

            this.notificationService.showError(error);
          });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

