import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { LoginUser } from '../../../../core/models/login-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

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
        Validators.maxLength(100)])
      ],
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ]
    });
  }

  onSubmitAuth(): void {
    this.dataLoading = true;

    if (this.authForm.valid) {
      const loginUserData = this.authForm.value;
      // console.log(1, 'loginUserData', loginUserData)

      this.authService.login(loginUserData).pipe(
        takeUntil(this.destroy))
        .subscribe(resp => {
          this.loginResp = resp;
          console.log('LoginComponent Resp', this.loginResp)
          if (resp) {
            this.dataLoading = false;
            this.authService.account$.next(true);
          }
        });
    }
    // this.dataLoading = false;
    // this.authService.account$.next(true);

  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

