import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from '../../../../core/models/user.model';
import { UsersService } from '../../users.service';
import { Observable, startWith, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { AddUser, DeleteUser, SetSelectedUser, UpdateUser, UpdateUserPassword } from '../../store-users/users.action';
import { ROLES } from '../../../../shared/constants/roles';
import { COUNTRIES } from '../../../../shared/constants/countries';
import { map } from 'rxjs/operators';
import { CountriesModel } from '../../../../core/models/countriesModel';
import { MustMatch } from '../../../../core/helpers/must-match.validator';
import { AppRouteEnum } from '../../../../core/enums';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { DialogNewPasswordComponent } from '../dialog-new-password/dialog-new-password.component';
import { UpdateCategory } from '../../../posts/store-posts/posts.action';

const defaultProfileImage = 'assets/images/avatar_1.jpg';


@Component({
  selector: 'app-edit-users',
  templateUrl: './dialog-users.component.html',
  styleUrls: ['./dialog-users.component.scss']
})
export class DialogUsersComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public dialogRefUsersComponent: MatDialogRef<DialogUsersComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public usersService: UsersService,
    public dialog: MatDialog
  ) {
  }

  dataLoading: boolean = false;
  AppRouteEnum = AppRouteEnum;

  private subUser: Subscription;
  roleList = ROLES;
  countriesList = COUNTRIES;
  userForm: FormGroup;
  hide = true;
  currentUser: UserModel;
  respNewUser: UserModel;
  respUpdateUser: UserModel;

  avatarUrl: any;
  previousImageUrl = '';
  avatarFile = '';
  avatarImageDefault: any;
  filteredCountries: Observable<CountriesModel[]>;

  ngOnInit() {
    this.buildForm();
    console.log('ngOnInit DialogUsers data', this.data)
    this.avatarImageDefault = defaultProfileImage;
    if (this.data.newUser) {
      this.userForm.reset();
      this.addPasswordControls();
      // this.userForm.addControl('new', new FormControl('', Validators.required));
      // this.userForm.addControl('new', new FormControl<string | null>('', Validators.required));

      this.userForm.patchValue({
        status: true
      });
    } else {
      this.initFormValue();
    }
    this.autocompleteCountries();
  }

  private buildForm() {
    this.userForm = this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.maxLength(100)])
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
      location: [null, Validators.compose([
        Validators.required])],
      // password: [null, Validators.compose([
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(50)])
      // ],
      birthAt: [null, Validators.compose([
        Validators.required])],
      status: '',
    });
  }

  addPasswordControls(): void {
    this.userForm = this.fb.group({
      ...this.userForm.controls,
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

  private initFormValue() {
    this.dataLoading = true;

    const id: number = this.data.id;
    this.subUser = this.usersService.getUser(id).subscribe(data => {
      if (data) {
        this.dataLoading = false;
      }
      this.currentUser = data;
      this.previousImageUrl = data.avatar;
      this.avatarUrl = data.avatar;

      console.log('getUser() = currentUser ', this.currentUser)

      this.userForm.setValue({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        location: data.location,
        status: data.status,
        // password: data.password,
        birthAt: data.birthAt,
      });
      this.store.dispatch(new SetSelectedUser(data));
    });
  }

  private autocompleteCountries() {
    this.filteredCountries = this.userForm.controls['location'].valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.countriesList.slice())),
    );
  }

  private _filterStates(value: string): CountriesModel[] {
    const filterValue = value.toLowerCase();
    return this.countriesList.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  /**
   Image upload
   */
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

  /**
   Adding Image Preview
   */
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
    const avatar = this.avatarFile;
    const params: any = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      role: Number(this.userForm.value.role),
      location: this.userForm.value.location,
      status: this.userForm.value.status,
      birthAt: this.userForm.value.birthAt,
      avatar: ''
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
    let {id} = this.currentUser
    const avatar = this.avatarFile;
    const previousImageUrl = this.previousImageUrl;
    let imageOrUrl: boolean;
    imageOrUrl = !!this.avatarUrl;
    const params: any = {
      id: id,
      email: this.userForm.value.email,
      // password: this.userForm.value.password,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      role: Number(this.userForm.value.role),
      location: this.userForm.value.location,
      status: this.userForm.value.status,
      birthAt: this.userForm.value.birthAt,
      avatar: '',
    };
    this.store.dispatch(new UpdateUser(id, params, avatar, imageOrUrl, previousImageUrl));
  }

  openDialogNewPassword(currentUser: UserModel) {
    console.log('openDialogNewPassword - currentUser', currentUser)
    const {id, email} = currentUser;
    const dialogRef = this.dialog.open(DialogNewPasswordComponent, {
      data: {
        userId: id,
        email,
        title: 'Change Password',
        okText: 'Submit',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Change Password - afterClosed', result);

      if (result === true) {
      } else {
        return
      }
    });

  }


  closeClick(): void {
    this.dialogRefUsersComponent.close();
  }

  ngOnDestroy(): void {
    this.subUser?.unsubscribe();
    this.dialogRefUsersComponent.close();
  }


}

