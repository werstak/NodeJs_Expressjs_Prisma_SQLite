import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, ReplaySubject, takeUntil } from 'rxjs';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit, OnDestroy{
  public userFilterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public usersService: UsersService
  ) {
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  ngOnInit() {
    this.buildForm();
    this.onChanges();
  }

  private buildForm() {
    this.userFilterForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: ''
    });
  }

  private onChanges(): void {
    this.userFilterForm.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy)).subscribe(val => {
      this.usersService.usersFilters$.next(val)
    });
  }


  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
