import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from '../../../../shared/models/user.model';
import { UsersService } from '../../users.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../shared/notification.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-edit-users',
  templateUrl: './dialog-users.component.html',
  styleUrls: ['./dialog-users.component.scss']
})
export class DialogUsersComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DialogUsersComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public usersService: UsersService,
    private notificationService: NotificationService,
  ) {
  }


  public editUserForm: FormGroup;
  private subUser: Subscription;
  private unsubscribe = new Subject<void>();
  private usersArr: UserModel[] = [];
  hide = true;
  currentUser: UserModel;
  respNewUser: UserModel;
  respUpdateUser: UserModel;


  ngOnInit() {
    this.getUsers();
    this.buildForm();

    console.log('DIALOG  data', this.data)

    if (this.data.newUser == true) {
      this.editUserForm.reset();
    } else {
      this.initFormValue();
    }
  }

  private getUsers(): void {
    this.usersService.users$.subscribe((users) => {
      this.usersArr = users;
      console.log('1 getUsers  = usersArr', this.usersArr)
    });
  }


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
      avatar: [null, Validators.compose([])
      ],
    });
  }

  private initFormValue() {
    const id: number = this.data.id;
    this.subUser = this.usersService.getUser(id).subscribe(data => {

      this.currentUser = data
      console.log('getUser()', this.currentUser)

      this.editUserForm.setValue({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        password: data.password,
        avatar: ''
      });
    });
  }

  onSubmit(): void {
    if (this.data.newUser == true) {
      this.addNewUser();
    } else {
      this.updateUser();
    }
  }

  private addNewUser(): void {
    if (this.editUserForm.invalid) {
      return;
    }
    console.log(1, 'onSubmit()', this.editUserForm.value)

    const params: any = {
      email: this.editUserForm.value.email,
      password: this.editUserForm.value.password,
      firstName: this.editUserForm.value.firstName,
      lastName: this.editUserForm.value.lastName,
      // role: this.editUserForm.value.role,
      role: Number(this.editUserForm.value.role),
      avatar: this.editUserForm.value.avatar,
    };

    this.usersService.addUser(params)
      .pipe(
        // takeUntil(this.unsubscribe)
      )
      .subscribe(
        (response) => {
          this.respNewUser = response;
          console.log('addNewUser response', response);
          this.addNewUserInTable();
          this.notificationService.showSuccess('User created successfully');
        },
        (error) => {
          console.error(error);
          const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
          const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
          this.notificationService.showError(secondErrorAttempt);
        }
      );
  }


  private addNewUserInTable() {
    this.usersArr.push(this.respNewUser);
    console.log('usersArr', this.usersArr)
    this.usersService.users$.next(this.usersArr);
  }


  private updateUser(): void {
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

    this.usersService.updateUser(this.currentUser.id, params)
      .pipe(
        // takeUntil(this.unsubscribe)
      )
      .subscribe(
        (response) => {
          this.respUpdateUser = response;
          console.log('RESPONSE Update User', response);
          this.updateUserInTable(id);
          this.notificationService.showSuccess('User updated successfully');
        },
        (error) => {
          console.error(error);
          const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
          const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
          this.notificationService.showError(secondErrorAttempt);
        }
      );
  }


  private updateUserInTable(id: number) {
    console.log('updateUserInTable - usersArr', this.usersArr)

    const updateUsersArr = this.usersArr.map(item => {
      if (item.id === id) {
        item = this.respUpdateUser;
        return item;
      }
      return item;
    });
    console.log('updateUsersArr', updateUsersArr)
    this.usersService.users$.next(updateUsersArr);
  }


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
