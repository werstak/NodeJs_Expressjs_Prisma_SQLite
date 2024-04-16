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
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetTokenModel } from '../../../core/models/password-reset-token.model';
import { ValidResetTokenModel } from '../../../core/models/valid-reset-token.model';
import { NotificationService } from '../../notification.service';

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
    private router: Router,
    public usersService: UsersService,
    private authService: AuthService,
    private notificationService: NotificationService,
    // private activatedRoute: ActivatedRoute
  ) {
  }


  @Input() userData: DialogNewPasswordModel;
  @Output() closeDialogDialogNewPassword: EventEmitter<any> = new EventEmitter();

  AppRouteEnum = AppRouteEnum;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;
  validCurrentPassword: any;
  validResetToken: ValidResetTokenModel = {valid: false};
  changePasswordForm: FormGroup;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;


  ngOnInit() {
    this.buildChangePasswordForm();

    if (this.userData) {

      this.changesControlCurrentPassword();
      this.toggleStateControls();

    } else {
      this.stateValidResetToken();

    }
  }

  private stateValidResetToken() {
    this.authService.validResetToken$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.validResetToken = resp;

        console.log(2, 'this.validResetToken', this.validResetToken);
        this.toggleStateControls();
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

  private checkValidCurrentPassword(val: string) {

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
          this.toggleStateControls();
        }
      });
  }

  private toggleStateControls() {
    console.log(3, 'toggleStateControls() - ', 'validCurrentPassword =', this.validCurrentPassword?.validPassword)
    console.log(3, 'toggleStateControls() - ', 'validResetToken =', this.validResetToken.valid)

    if (this.validCurrentPassword?.validPassword || this.validResetToken.valid) {
      this.changePasswordForm.controls['newPassword'].enable();
      this.changePasswordForm.controls['confirmPassword'].enable();
    } else {
      this.changePasswordForm.controls['newPassword'].disable();
      this.changePasswordForm.controls['confirmPassword'].disable();
    }
  }

  public allowedSubmit(): boolean {
    if (this.userData) {
      return !(!this.changePasswordForm.valid || !this.validCurrentPassword?.validPassword);
    } else {
      return !(!this.changePasswordForm.controls['newPassword'].valid || !this.changePasswordForm.controls['confirmPassword'].valid || !this.validResetToken.valid);
    }
  }

  onSubmitChangePassword(): void {

    if (this.userData) {
      console.log(11111111)
      if (this.changePasswordForm.valid) {

        this.dataLoading = true;

        const id = this.userData.userId;
        const params = {
          password: this.changePasswordForm.value.newPassword
        }
        this.store.dispatch(new UpdateUserPassword(id, params));
        this.dataLoading = false;
        this.closeClick();
      } else {
        return;
      }
    } else {
      console.log(2222222)

      if (this.changePasswordForm.controls['newPassword'].valid && this.changePasswordForm.controls['confirmPassword'].valid) {
        console.log(3333333)
        this.dataLoading = true;
        // const id = Number(this.validResetToken.id);
        // const passwordParams = {
        //   password: this.changePasswordForm.value.newPassword
        // }

        this.authService.changePassword(this.changePasswordForm.value.newPassword, this.validResetToken).pipe(
          takeUntil(this.destroy))
          .subscribe(resp => {
              if (resp) {
                console.log(13, 'changePassword()', resp);
                this.notificationService.showSuccess(resp.message);
                this.router.navigate(['auth/login']);
              }
            },
            (error) => {
              console.error(error);
              this.notificationService.showError(error);
            });
        this.dataLoading = false;
      } else {
        console.log(4444444)
        return;
      }


    }


  }


  //
  // onSubmitChangePassword(): void {
  //   console.log(333, this.changePasswordForm)
  //   if (this.changePasswordForm.valid) {
  //
  //     this.dataLoading = true;
  //
  //     // TODO - redo the method for obtaining User ID depending on whether the user is logged in or not
  //     // Take information from the URL if the user came to the site using a link
  //     // this.getUrlParams()
  //
  //     const id = this.userData.userId;
  //     // const id = this.userData.userId ? this.userData.userId : ;
  //
  //     const params = {
  //       password: this.changePasswordForm.value.newPassword
  //     }
  //     this.store.dispatch(new UpdateUserPassword(id, params));
  //     this.dataLoading = false;
  //     this.closeClick();
  //   } else {
  //     return;
  //   }
  // }

  closeClick(): void {
    this.closeDialogDialogNewPassword.emit();
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.authService.validResetToken$.next(undefined);
    this.validResetToken = {};
  }


}
