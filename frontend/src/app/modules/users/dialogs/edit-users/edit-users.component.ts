import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostsModel, UserModel } from '../../../../shared/models/user.model';
import { UsersService } from '../../users.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../shared/notification.service';
import * as _ from "lodash";


@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit, OnDestroy {
  // ostypes: OsTypeInterface[] = [
  //   {value: 'ios', viewValue: 'ios'},
  //   {value: 'android', viewValue: 'android'}
  // ];
  public editUserForm: FormGroup;
  private subUser: Subscription;
  hide = true;
  currentUser: UserModel;
  private unsubscribe = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<EditUsersComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public usersService: UsersService,
              private notificationService: NotificationService,
              // public clientsService: ClientsService
  ) {
  }


  submitted = false;


  // // id: number;
  // email: string;
  // // password?: string;
  // firstName: string;
  // lastName: string;
  // // createdAt?: string
  // // updatedAt?: string
  // role: number
  // avatar: string
  // posts?: PostsModel[]


  ngOnInit() {
    this.buildForm();
    this.initFormValue();
  }


  // initForm() {
  //   const { fb } = this;
  //   this.form = fb.group({
  //     name: fb.control(null),
  //     fields: fb.array([]),
  //     status: fb.control(null)
  //   });
  //
  //   this.form.valueChanges.pipe(
  //     tap(() => this.topBarService.showNavActions()),
  //     debounceTime(500),
  //     takeUntil(this.componentDestroy$)
  //   ).subscribe(val => console.log(new Date().getTime(), 'value change', val));
  // }

  private buildForm() {
    this.editUserForm = this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.maxLength(50)])
      ],
      firstName: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      lastName: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      role: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(50)])
      ],
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
    });
  }

  private initFormValue() {

    const id: number = this.data.id;
    console.log('MODAL', id)

    this.subUser = this.usersService.getUser(id).subscribe(data => {

      this.currentUser = data
      console.log('getUser()', this.currentUser)

      this.editUserForm.setValue({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        password: data.password,
      });


      // return this.data = data;
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editUserForm.invalid) {
      return;
    }
    console.log(1, 'onSubmit()', this.editUserForm.value)

    let {id} = this.currentUser

    const params: UserModel = {
      id: id,
      email: this.editUserForm.value.email,
      password: this.editUserForm.value.password,
      firstName: this.editUserForm.value.firstName,
      lastName: this.editUserForm.value.lastName,
      // role: this.editUserForm.value.role,
      role: Number(this.editUserForm.value.role),
      avatar: this.editUserForm.value.avatar,
    };

    // this.usersService.updateUser(this.currentUser.id, params).subscribe();


    this.usersService.updateUser(this.currentUser.id, params)
      .pipe(
        // takeUntil(this.unsubscribe)
      )
      .subscribe(
        (response) => {
          this.notificationService.showSuccess("User updated successfully");
        },
        (error) => {
          console.error(error);
          const firstErrorAttempt: string = _.get(error, "error.error.message", "An error occurred");
          const secondErrorAttempt: string = _.get(error, "error.message", firstErrorAttempt);
          this.notificationService.showError(secondErrorAttempt);
        }
      );
  }



// /*TODO*/
//   onSubmit() {
//     this.submitted = true;
//
//     // reset alerts on submit
//     this.alertService.clear();
//
//     // stop here if form is invalid
//     if (this.form.invalid) {
//       return;
//     }
//
//     this.submitting = true;
//     this.accountService.update(this.account.id!, this.form.value)
//       .pipe(first())
//       .subscribe({
//         next: () => {
//           this.alertService.success('Update successful', { keepAfterRouteChange: true });
//           this.router.navigate(['../'], { relativeTo: this.route });
//         },
//         error: error => {
//           this.alertService.error(error);
//           this.submitting = false;
//         }
//       });
//   }


  /*TODO*/

  // onDelete() {
  //   if (confirm('Are you sure?')) {
  //     this.deleting = true;
  //     this.accountService.delete(this.account.id!)
  //       .pipe(first())
  //       .subscribe(() => {
  //         this.alertService.success('Account deleted successfully', { keepAfterRouteChange: true });
  //       });
  //   }
  // }


  closeClick(): void {
    this.dialogRef.close();
  }

  // ngOnDestroy() {
  //   this.subUser.unsubscribe();
  // }

  ngOnDestroy(): void {
    this.dialogRef.close();

    // this.unsubscribe.next();
    // this.unsubscribe.complete();
  }


}
