import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../modules/auth/auth.service';
import { ReplaySubject } from 'rxjs';
import { MustMatch } from '../../../core/helpers/must-match.validator';
import { UpdateUserPassword } from '../../../modules/users/store-users/users.action';
import { Store } from '@ngxs/store';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogNewPasswordComponent } from '../../../modules/users/dialogs/dialog-new-password/dialog-new-password.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    public store: Store,
    private authService: AuthService,
    // public dialogRefNewPasswordComponent: MatDialogRef<DialogNewPasswordComponent>,
  ) {
  }


  @Input() userId: number | undefined;
  @Output() closeDialogDialogNewPassword: EventEmitter<any> = new EventEmitter();

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;
  changePasswordForm: FormGroup;
  hide = true;


  ngOnInit() {
    this.buildChangePasswordForm();
    // console.log('ChangePasswordComponent - userId', this.userId)
  }

  private buildChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      password: [null, Validators.compose([
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
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onSubmitChangePassword(): void {
    if (this.changePasswordForm.valid) {

      this.dataLoading = true;
      // console.log('onSubmitChangePassword password', this.changePasswordForm.value.password)
      // console.log('onSubmitChangePassword userId', this.userId)
      const id = this.userId;
      const params = {
        password: this.changePasswordForm.value.password
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
