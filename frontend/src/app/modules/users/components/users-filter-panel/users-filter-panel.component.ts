import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, ReplaySubject, Subject, takeUntil } from 'rxjs';
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
  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();  rolesList = ROLES;


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
      takeUntil(this.destroy$)).subscribe(val => {

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
      this.usersService.usersFilters$.next(filterData)
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
