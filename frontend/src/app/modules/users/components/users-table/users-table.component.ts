import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../users.service';
import { UserModel } from '../../../../core/models/user.model';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsersComponent } from '../../dialogs/dialog-users/dialog-users.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { MatTable } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { DeleteUser, GetUsers } from '../../store-users/users.action';
import { UsersSelectors } from '../../store-users/users.selectors';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { UserFilterModel } from '../../../../core/models/user-filter.model';


@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public usersService: UsersService,
    public dialog: MatDialog
  ) {
  }

  @Select(UsersSelectors.getUsersList) users: Observable<UserModel[]>;
  @Select(UsersSelectors.getUsersCounter) usersCounter: Observable<any>;

  @ViewChild(MatTable) table: MatTable<UserModel[]>;
  @ViewChild(MatSort) sort: MatSort;


  /**
   Pagination variables
   */
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [3, 5, 10, 15, 20, 25];
  previousPageIndex = 0;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;

  /** Columns table*/
  displayedColumns = ['id', 'avatar', 'email', 'firstName', 'lastName', 'createdAt', 'role', 'posts', 'status', 'location', 'birthAt', 'actions'];

  users$ = this.usersService.users$;

  dataLoading: boolean = false;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  /** Sorting the table */
  orderByColumn = 'id' as SortDirection;
  orderByDirection = 'asc' as SortDirection;

  /** Filters */
  private defaultUsersFilters: UserFilterModel = {email: '', firstName: '', lastName: '', roles: []};
  private usersFilters: UserFilterModel = this.defaultUsersFilters;


  ngOnInit(): void {
    this.fetchData();
    this.getUsersFilter();
  }

  private fetchData() {
    const params = {
      orderByColumn: this.orderByColumn,
      orderByDirection: this.orderByDirection,

      pageIndex: this.pageIndex,
      pageSize: this.pageSize,

      firstName: this.usersFilters.firstName,
      lastName: this.usersFilters.lastName,
      email: this.usersFilters.email,
      roles: this.usersFilters.roles
    }

    this.dataLoading = true;
    this.store.dispatch(new GetUsers(params));

    this.users.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.usersService.users$.next(resp);
        if (resp) {
          this.dataLoading = false;
        }
      });

    this.usersCounter.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.length = resp;
      });
  }

  sortData($event: any) {
    this.orderByColumn = $event.active;
    this.orderByDirection = $event.direction;
    this.fetchData();
  }

  private getUsersFilter() {
    this.usersService.usersFilters$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        if (!Object.keys(resp).length) {
          this.usersFilters = this.defaultUsersFilters;
        } else {
          this.usersFilters = resp
          this.fetchData();
        }
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchData();
  }

  addUser() {
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: {newUser: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result)
      setTimeout(() => {
        this.table.renderRows();
      }, 1000)

      // if (result === 1) {
      //   this.table.renderRows();
      // }
    });
  }

  editUser(id: UserModel) {
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: {id, newUser: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('EDIT dialogRef result', result)

      setTimeout(() => {
        this.table.renderRows();
      }, 1000)

      // if (result === 1) {
      //   this.table.renderRows();
      // }
    });
  }

  deleteUser(user: UserModel): void {
    let {id, firstName, avatar} = user;
    const params = {
      avatar
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: firstName,
        title: 'Delete user - ',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('deleteUser - afterClosed', result)
      if (result === true) {
        this.store.dispatch(new DeleteUser(id, params));
      } else {
        return
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
