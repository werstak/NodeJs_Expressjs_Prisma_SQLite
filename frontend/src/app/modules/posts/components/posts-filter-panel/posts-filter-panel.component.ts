import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PostsService } from '../../posts.service';
import { debounceTime, Observable, ReplaySubject, startWith, takeUntil } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UsersService } from '../../../users/users.service';
import { GetCategories, GetListAllUsers } from '../../store-posts/posts.action';
import { UserListModel } from '../../../../core/models/user-list.model';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { map } from 'rxjs/operators';
import { CategoriesModel } from '../../../../core/models/categories.model';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogCategoriesPostComponent } from '../../dialogs/dialog-categories-post/dialog-categories-post.component';

@Component({
  selector: 'app-posts-filter-panel',
  templateUrl: './posts-filter-panel.component.html',
  styleUrls: ['./posts-filter-panel.component.scss']
})

export class PostsFilterPanelComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    public postsService: PostsService,
    public dialog: MatDialog,
    public store: Store,
    public usersService: UsersService
  ) {
  }

  @Select(PostsSelectors.getListUsers) listAllUsers$: Observable<UserListModel[]>;
  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;

  private filterData: any = {authors: [], categories: []};
  public postFilterForm: FormGroup
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);


  /** Searchable Multiselect Filters*/
  @ViewChild('search') searchTextBox: ElementRef;
  @ViewChild('searchCategories') searchCategories: ElementRef;

  searchTextboxControl = new FormControl();
  searchTextboxControlCategories = new FormControl();

  listAllUsers: any = [];
  listAllCategories: CategoriesModel[] = [];

  selectedValues: any = [];
  selectedValuesCategories: any = [];

  filteredOptions: Observable<any['']>;
  filteredOptionsCategories: Observable<any['']>;


  ngOnInit() {
    this.fetchUsers();
    this.fetchCategories();
    this.buildForm();
    this.onChangesControlAuthors();
    this.onChangesControlCategories();
  }

  private fetchUsers() {
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

  private buildForm() {
    this.postFilterForm = this.fb.group({
      authors: [],
      categories: []
    });
  }

  private onChangesControlAuthors(): void {
    this.postFilterForm.controls['authors'].valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy)
    ).subscribe(val => {

      let arrAuthors = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          arrAuthors.push(val[i].id);
        }
      } else if (!Object.keys(val).length) {
        arrAuthors = [];
      }
      this.filterData.authors = arrAuthors;
      this.postsService.postsFilters$.next(this.filterData)
    });
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    this.setSelectedValues();
    this.postFilterForm.controls['authors'].patchValue(this.selectedValues);
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

  openedChangeAuthors(e: any) {
    this.searchTextboxControl.patchValue('');
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
    if (this.postFilterForm.controls['authors'].value && this.postFilterForm.controls['authors'].value.length > 0) {
      this.postFilterForm.controls['authors'].value.forEach((e: any) => {
        if (this.selectedValues.indexOf(e) == -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }

  /**
   Filter Categories
   */
  private fetchCategories() {
    this.store.dispatch(new GetCategories());
    this.listAllCategories$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.listAllCategories = resp;
        if (this.listAllUsers.length) {
          this.filteredCategories();
        }
      });
  }

  private filteredCategories() {
    this.filteredOptionsCategories = this.searchTextboxControlCategories.valueChanges
      .pipe(
        startWith<any>(''),
        map(name => this._filterCategories(name))
      );
  }

  /**
   * Used to filter data based on search input in Categories
   */
  private _filterCategories(name: string): any[] {
    const filterValue = name.toLowerCase();
    this.setSelectedValuesCategories();
    this.postFilterForm.controls['categories'].patchValue(this.selectedValuesCategories);
    return this.listAllCategories.filter((option: any) => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private onChangesControlCategories(): void {
    this.postFilterForm.controls['categories'].valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy)
    ).subscribe(val => {
      let arrCategories = [];
        if (val.length) {
          for (let i = 0; i < val.length; i++) {
            arrCategories.push(val[i].id);
          }
        } else if (!Object.keys(val).length) {
          arrCategories = [];
        }
        this.filterData.categories = arrCategories;
        this.postsService.postsFilters$.next(this.filterData)
      }
    );
  }

  /**
   * Remove from selected values based on uncheck Categories
   */
  selectionChangeCategories(event: any) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValuesCategories.indexOf(event.source.value);
      this.selectedValuesCategories.splice(index, 1)
    }
  }

  openedChangeCategories(e: any) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControlCategories.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchCategories.nativeElement.focus();
    }
  }

  /**
   * Clearing search textbox value Categories
   */
  clearSearchCategories(event: any) {
    event.stopPropagation();
    this.searchTextboxControlCategories.patchValue('');
  }

  /**
   * Set selected values to retain the state Categories
   */
  setSelectedValuesCategories() {
    if (this.postFilterForm.controls['categories'].value && this.postFilterForm.controls['categories'].value.length > 0) {
      this.postFilterForm.controls['categories'].value.forEach((e: any) => {
        if (this.selectedValuesCategories.indexOf(e) == -1) {
          this.selectedValuesCategories.push(e);
        }
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCategoriesPostComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addPost() {
    const dialogRef = this.dialog.open(DialogPostsComponent, {
      data: {newPost: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result)
    });
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
