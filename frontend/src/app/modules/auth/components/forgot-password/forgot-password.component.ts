import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy{
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

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
        Validators.maxLength(100)])
      ]
    });
  }

  onSubmitRecovery(): void {
    if (this.recoveryForm.valid) {
      this.dataLoading = true;
      // this.addNewUser();
      this.dataLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
