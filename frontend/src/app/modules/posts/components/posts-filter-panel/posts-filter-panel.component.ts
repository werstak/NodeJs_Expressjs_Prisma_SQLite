import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PostsService } from '../../posts.service';
import { debounceTime, Observable, ReplaySubject, startWith, takeUntil } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UsersService } from '../../../users/users.service';
import { GetListAllUsers } from '../../store-posts/posts.action';
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
    public usersService: UsersService,
    private cdref: ChangeDetectorRef
  ) {
  }

  @Select(PostsSelectors.getListUsers) listAllUsers$: Observable<UserListModel[]>;

  public postFilterForm: FormGroup
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);


  /** Searchable Multiselect Select*/
  @ViewChild('search') searchTextBox: ElementRef;

  listAllUsers: any = [];

  searchTextboxControl = new FormControl();
  selectedValues: any = [];

  filteredOptions: Observable<any['']>;


  ngOnInit() {
    this.fetchData();
    this.buildForm();
    this.onChanges();

  }


  private buildForm() {
    this.postFilterForm = this.fb.group({
      authors: []
    });
  }


  private onChanges(): void {
    this.postFilterForm.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy)).subscribe(val => {

      console.log(111, 'FORM Filter', val)
      let arrAuthors = [];
      if (val.authors) {
        for (let i = 0; i < val.authors.length; i++) {
          arrAuthors.push(val.authors[i].id);
        }
      } else {
        arrAuthors = [];
      }

      let filterData = {
        authors: arrAuthors
      }

      console.log(222, 'NEXT filterData', filterData)
      this.postsService.postsFilters$.next(filterData)
    });
  }

  private fetchData() {
    this.store.dispatch(new GetListAllUsers());
    this.listAllUsers$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.listAllUsers = resp;
        if (this.listAllUsers.length) {
          this.filteredUsers();
        }
      });
  }

  private filteredUsers() {
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(name => this._filter(name))
      );
  }


  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.postFilterForm.controls['authors'].patchValue(this.selectedValues);
    console.log(222, this.listAllUsers)
    return this.listAllUsers.filter((option: any) => option.firstName.toLowerCase().indexOf(filterValue) === 0);
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
    console.log('authors', this.postFilterForm.controls['authors'].value);
    if (this.postFilterForm.controls['authors'].value && this.postFilterForm.controls['authors'].value.length > 0) {
      this.postFilterForm.controls['authors'].value.forEach((e: any) => {
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
