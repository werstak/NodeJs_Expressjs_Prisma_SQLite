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
  constructor(public dialogRef: MatDialogRef<EditUsersComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public usersService: UsersService,
              private notificationService: NotificationService,
              // public clientsService: ClientsService
  ) {
  }


  public editUserForm: FormGroup;
  private subUser: Subscription;
  hide = true;
  currentUser: UserModel;
  respNewUser: UserModel;
  private unsubscribe = new Subject<void>();
  private usersArr: UserModel[] = [];
  submitted = false;


  ngOnInit() {
    this.buildForm();
    this.getUsers();

    console.log('DIALOG  data', this.data)

    if (this.data.newUser == true) {
      this.editUserForm.reset();
    } else {
      this.initFormValue();
    }
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
        avatar: ''
      });

      return this.data = data;
    });
  }

  onSubmit(): void {
    if (this.data.newUser == true) {
      this.addNewUser();
    } else  {
      this.updateUser();
    }
  }

  private addNewUser(): void {
    this.submitted = true;
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

          this.notificationService.showSuccess("User created successfully");
        },
        (error) => {
          console.error(error);
          const firstErrorAttempt: string = _.get(error, "error.error.message", "An error occurred");
          const secondErrorAttempt: string = _.get(error, "error.message", firstErrorAttempt);
          this.notificationService.showError(secondErrorAttempt);
        }
      );

  }

 private getUsers(): void {
   this.usersService.users$.subscribe((users) => {
       this.usersArr = users;
       console.log('usersArr', this.usersArr)
   });
  }


  private addNewUserInTable() {
    this.usersArr.push(this.respNewUser);
    console.log('usersArr', this.usersArr)
    this.usersService.users$.next(this.usersArr);
    return 1;
  }

  // private addNewUserInTable(): void {
  //   console.log('addNewUserInTable')
  //   this.usersService.users$.subscribe((users) => {
  //     if (users) {
  //       const usersArr = users;
  //       usersArr.push(this.respNewUser);
  //       console.log('usersArr', usersArr)
  //       this.usersService.users$.next(users);
  //     } else {
  //       return;
  //     }
  //   });
  // }


  private updateUser(): void {

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
