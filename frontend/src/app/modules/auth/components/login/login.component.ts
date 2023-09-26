import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogUsersComponent } from '../../../users/dialogs/dialog-users/dialog-users.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
  ) {
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  authForm: FormGroup;
  hide = true;


  ngOnInit() {
    this.buildForm();
  }


  submit() {
    if (this.authForm.valid) {
      // this.submitEM.emit(this.form.value);
    }
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

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

