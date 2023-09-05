import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from '../../../../shared/models/user.model';
import { UsersService } from '../../users.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { AddUser, SetSelectedUser, UpdateUser } from '../../store-users/users.action';
import { ROLES } from '../../../../shared/constants/roles';

const customProfileImage = 'assets/images/avatar_1.jpg';


@Component({
  selector: 'app-edit-users',
  templateUrl: './dialog-users.component.html',
  styleUrls: ['./dialog-users.component.scss']
})
export class DialogUsersComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public dialogRef: MatDialogRef<DialogUsersComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public usersService: UsersService
  ) {
  }

  rolesList = ROLES;
  public userForm: FormGroup;
  private subUser: Subscription;
  hide = true;
  currentUser: UserModel;
  respNewUser: UserModel;
  respUpdateUser: UserModel;

  avatarUrl: any;
  previousImageUrl = '';
  avatarFile = '';
  avatarImageDefault: any;


  ngOnInit() {
    this.buildForm();
    console.log('DIALOG  data', this.data)
    this.avatarImageDefault = customProfileImage;
    if (this.data.newUser) {
      this.userForm.reset();
    } else {
      this.initFormValue();
    }
  }

  private buildForm() {
    this.userForm = this.fb.group({
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
    this.subUser = this.usersService.getUser(id).subscribe(data => {

      console.log('getUser', data)

      this.currentUser = data;
      this.previousImageUrl = data.avatar;
      this.avatarUrl = data.avatar;

      console.log('getUser()', this.currentUser)

      this.userForm.setValue({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        password: data.password,
      });
      this.store.dispatch(new SetSelectedUser(data));
    });
  }


  /** Image upload */
  handleImageLoaded(event: any) {
    if (event.target.files && event.target.files[0]) {
      const files = event.target.files;
      let invalidFlag = false;
      const pattern = /image-*/;
      for (const file of files) {
        if (!file.type.match(pattern)) {
          invalidFlag = true;
          alert('invalid format');
        }
      }
      this.handleImagePreview(files);
    }
  }

  handleImagePreview(files: any): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.avatarUrl = event.target.result;
    }
    this.avatarFile = files[0];
    reader.readAsDataURL(files[0]);
  }

  /**
   Delete Avatar
   */
  public deleteAvatar() {
    this.avatarUrl = '';
    this.avatarFile = '';
  }

  /**
   Sending the Form
   */
  onSubmitUser(): void {
    if (this.data.newUser) {
      this.addNewUser();
    } else {
      this.updateUser();
    }
  }


  /**
   Adding a new User
   */
  private addNewUser(): void {
    if (this.userForm.invalid) {
      return;
    }
    console.log(1, 'onSubmitUser()', this.userForm.value)

    const avatar = this.avatarFile;
    const params: any = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      // role: this.userForm.value.role,
      role: Number(this.userForm.value.role),
      avatar: '',
    };
    this.store.dispatch(new AddUser(params, avatar));
  }


  /**
   Update User
   */
  private updateUser(): void {
    if (this.userForm.invalid) {
      return;
    }
    console.log(1, 'onSubmitUser()', this.userForm.value)

    let {id} = this.currentUser
    const avatar = this.avatarFile;
    const previousImageUrl = this.previousImageUrl;
    let imageOrUrl: boolean;
    imageOrUrl = !!this.avatarUrl;
    const params: UserModel = {
      id: id,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      // role: this.userForm.value.role,
      role: Number(this.userForm.value.role),
      avatar: '',
    };
    this.store.dispatch(new UpdateUser(id, params, avatar, imageOrUrl, previousImageUrl));
  }


  closeClick(): void {
    this.dialogRef.close();
  }


  ngOnDestroy(): void {
    this.subUser?.unsubscribe();
    this.dialogRef.close();
  }
}

