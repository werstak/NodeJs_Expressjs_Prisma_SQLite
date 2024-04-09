import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../modules/auth/auth.service';
import { debounceTime, ReplaySubject, takeUntil } from 'rxjs';
import { MustMatch } from '../../../core/helpers/must-match.validator';
import { UpdateUserPassword } from '../../../modules/users/store-users/users.action';
import { Store } from '@ngxs/store';
import { DialogNewPasswordModel } from '../../../core/models/dialog-new-password.model';
import { UsersService } from '../../../modules/users/users.service';
import { AppRouteEnum } from '../../../core/enums';
import { ActivatedRoute } from '@angular/router';

interface ValidPassword {
  validPassword: boolean;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    public store: Store,
    public usersService: UsersService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
  }


  @Input() userData: DialogNewPasswordModel;
  @Output() closeDialogDialogNewPassword: EventEmitter<any> = new EventEmitter();

  AppRouteEnum = AppRouteEnum;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;
  validCurrentPassword: any;
  changePasswordForm: FormGroup;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;


  ngOnInit() {
    console.log('userData', this.userData)
    this.buildChangePasswordForm();
    this.changesControlCurrentPassword();
    this.toggleStateControls();
    this.getUrlParams();
  }

  private getUrlParams() {

    const firstParam: string | null = this.activatedRoute.snapshot.queryParamMap.get('firstParamKey');
    const secondParam: string | null = this.activatedRoute.snapshot.queryParamMap.get('secondParamKey');

    console.log(333, firstParam, secondParam)


    const urlParams = this.activatedRoute.snapshot;
    console.log(222, urlParams)

    // const selectedId = 'userId_' + urlParams[1].path;
    this.activatedRoute.queryParams.subscribe(params => {
      // console.log(111, 'params', params)

    });
  }

  private buildChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      newPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      confirmPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  private changesControlCurrentPassword() {
    this.changePasswordForm.controls['currentPassword'].valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy))
      .subscribe((val) => {
        this.checkValidCurrentPassword(val);
      });
  }

  private checkValidCurrentPassword(val: any) {
    const userData = {
      email: this.userData.email,
      password: val
    }

    this.authService.getValidPassword(userData).pipe(
      takeUntil(this.destroy))
      .subscribe((resp) => {
        if (resp) {
          this.validCurrentPassword = resp;
          this.toggleStateControls();
        } else {
          this.validCurrentPassword = resp;
          this.toggleStateControls();
        }
      });
  }

  private toggleStateControls() {
    if(this.validCurrentPassword?.validPassword) {
      this.changePasswordForm.controls['newPassword'].enable();
      this.changePasswordForm.controls['confirmPassword'].enable();
    } else {
      this.changePasswordForm.controls['newPassword'].disable();
      this.changePasswordForm.controls['confirmPassword'].disable();
    }
  }

  onSubmitChangePassword(): void {
    if (this.changePasswordForm.valid) {

      this.dataLoading = true;

      // TODO - redo the method for obtaining User ID depending on whether the user is logged in or not
      // Take information from the URL if the user came to the site using a link
      // this.getUrlParams()

      const id = this.userData.userId;
      // const id = this.userData.userId ? this.userData.userId : ;

      const params = {
        password: this.changePasswordForm.value.newPassword
      }
      this.store.dispatch(new UpdateUserPassword(id, params));
      this.dataLoading = false;
      this.closeClick();
    } else {
      return;
    }
  }

  closeClick(): void {
    this.closeDialogDialogNewPassword.emit();
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }


}
