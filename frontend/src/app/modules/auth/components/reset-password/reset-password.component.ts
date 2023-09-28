import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ReplaySubject } from 'rxjs';
import { MustMatch } from '../../../../core/helpers/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;
  resetForm: FormGroup;
  hide = true;


  ngOnInit() {
    this.buildResetForm();
  }

  private buildResetForm() {
    this.resetForm = this.fb.group({
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

  onSubmitReset(): void {
    if (this.resetForm.valid) {
      this.dataLoading = true;
      // this.someFunction();
      this.dataLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
