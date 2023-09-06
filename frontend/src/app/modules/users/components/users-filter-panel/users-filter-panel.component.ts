import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, ReplaySubject, takeUntil } from 'rxjs';
import { UsersService } from '../../users.service';

import { ROLES } from '../../../../shared/constants/roles';

@Component({
  selector: 'app-users-filter-panel',
  templateUrl: './users-filter-panel.component.html',
  styleUrls: ['./users-filter-panel.component.scss']
})
export class UsersFilterPanelComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    public usersService: UsersService
  ) {
  }

  public userFilterForm: FormGroup
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  rolesList = ROLES;


  ngOnInit() {
    this.buildForm();
    this.onChanges();
  }

  private buildForm() {
    this.userFilterForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
    });
  }

  private onChanges(): void {
    this.userFilterForm.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy)).subscribe(val => {

      // console.log(111, 'FORM', val)
      let arrRoles = [];
      if (val.roles) {
        for (let i = 0; i < val.roles.length; i++) {
          arrRoles.push(val.roles[i].id);
        }
      } else {
        arrRoles = [];
      }

      let filterData = {
        firstName: val.firstName,
        lastName: val.lastName,
        email: val.email,
        roles: arrRoles
      }

      console.log(222, 'NEXT filterData', filterData)
      this.usersService.usersFilters$.next(filterData)
    });
  }


  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
