import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, startWith, Subscription, takeUntil } from 'rxjs';
import { ROLES } from '../../../../shared/constants/roles';
import { COUNTRIES } from '../../../../shared/constants/countries';
import { UserModel } from '../../../../core/models/user.model';
import { CountriesModel } from '../../../../core/models/countriesModel';
import { map } from 'rxjs/operators';
import { MustMatch } from '../../../../core/helpers/must-match.validator';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private registerUserResp: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }


  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  dataLoading: boolean = false;

  private subUser: Subscription;

  roleList = ROLES;
  countriesList = COUNTRIES;
  registerForm: FormGroup;
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
    this.buildRegForm();
    // this.initRegFormValue();

    this.registerForm.patchValue({
      status: true
    });
    this.autocompleteCountries();
  }

  private buildRegForm() {
    this.registerForm = this.fb.group({
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
      // role: [null, Validators.compose([
      //   Validators.required,
      //   Validators.maxLength(50)])
      // ],
      location: [null, Validators.compose([
        Validators.required])],
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      confirmPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      birthAt: [null, Validators.compose([
        Validators.required])],
      status: '',
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // private initRegFormValue() {
  //   this.dataLoading = true;
  //
  //   const id: number = this.data.id;
  //   this.subUser = this.usersService.getUser(id).subscribe(data => {
  //     if (data) {
  //       this.dataLoading = false;
  //     }
  //     this.currentUser = data;
  //     this.previousImageUrl = data.avatar;
  //     this.avatarUrl = data.avatar;
  //
  //     console.log('getUser() = currentUser ', this.currentUser)
  //
  //     this.registerForm.setValue({
  //       email: data.email,
  //       firstName: data.firstName,
  //       lastName: data.lastName,
  //       role: data.role,
  //       location: data.location,
  //       status: data.status,
  //       password: data.password,
  //       birthAt: data.birthAt,
  //     });
  //     this.store.dispatch(new SetSelectedUser(data));
  //   });
  // }

  private autocompleteCountries() {
    this.filteredCountries = this.registerForm.controls['location'].valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.countriesList.slice())),
    );
  }

  private _filterStates(value: string): CountriesModel[] {
    const filterValue = value.toLowerCase();
    return this.countriesList.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  onSubmitNewUser(): void {
    this.dataLoading = true;

    if (this.registerForm.valid) {
      const registerUserData = this.registerForm.value;
      console.log(1, 'registerUserData', registerUserData)

      this.authService.register(registerUserData).pipe(
        takeUntil(this.destroy))
        .subscribe(resp => {
          this.registerUserResp = resp;
          console.log('registerUserResp', this.registerUserResp)
          if (resp) {
            this.authService.account$.next(true);
            this.dataLoading = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.subUser?.unsubscribe();
    this.destroy.next(null);
    this.destroy.complete();
  }


  closeClick() {

  }
}
