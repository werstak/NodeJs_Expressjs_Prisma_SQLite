import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PostsService } from '../../posts.service';
import { Observable, ReplaySubject, startWith, takeUntil } from 'rxjs';
import { ROLES } from '../../../../shared/constants/roles';
import { Select, Store } from '@ngxs/store';
import { UsersService } from '../../../users/users.service';
import { GetListAllUsers } from '../../store-posts/posts.action';
import { UsersSelectors } from '../../../users/store-users/users.selectors';
import { UserModel } from '../../../../shared/models/user.model';
import { UserListModel } from '../../../../shared/models/user-list.model';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { map } from 'rxjs/operators';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-posts-filter-panel',
  templateUrl: './posts-filter-panel.component.html',
  styleUrls: ['./posts-filter-panel.component.scss']
})
export class PostsFilterPanelComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    public postsService: PostsService,
    public store: Store,
    public usersService: UsersService
  ) {
  }

  @Select(PostsSelectors.getListUsers) listAllUsers$: Observable<UserListModel[]>;

  public postFilterForm: FormGroup
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  authorList = ROLES


  /** Searchable Multiselect Select*/
  @ViewChild('search') searchTextBox: ElementRef;

  listAllUsers: any = [];

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues: any = [];
  data: any[] = [
    'A1',
    'A2',
    'A3',
    'B1',
    'B2',
    'B3',
    'C1',
    'C2',
    'C3'
  ]

  filteredOptions: Observable<any[]>;


  ngOnInit() {
    this.fetchData();
    this.buildForm();
    this.filteredUsers();

    // this.filteredOptions = this.searchTextboxControl.valueChanges
    //   .pipe(
    //     startWith<any>(''),
    //     map(name => this._filter(name))
    //   );


    // this.onChanges();
  }

  private fetchData() {
    this.store.dispatch(new GetListAllUsers());

    this.listAllUsers$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.listAllUsers = resp;

        console.log(1111, 'listAllUsers', this.listAllUsers)
        // this.dataLoading = false;
      });
  }

  private filteredUsers() {
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(name => this._filter(name))
      );
  }

  private buildForm() {
    this.postFilterForm = this.fb.group({
      author: [],
      // firstName: '',
      // lastName: '',
      // email: '',
      // roles: [],
    });
  }


  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.selectFormControl.patchValue(this.selectedValues);
    console.log(222, this.listAllUsers)
    // let filteredList = this.listAllUsers.filter((option: any) => option.toLowerCase().indexOf(filterValue) === 0);
    let filteredList = this.data.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event: any) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1)
    }
  }

  openedChange(e: any) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event: any) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  /**
   * Set selected values to retain the state
   */
  setSelectedValues() {
    console.log('selectFormControl', this.selectFormControl.value);
    if (this.selectFormControl.value && this.selectFormControl.value.length > 0) {
      this.selectFormControl.value.forEach((e: any) => {
        if (this.selectedValues.indexOf(e) == -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }


  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }


}
