import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../users.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsersComponent } from '../../dialogs/dialog-users/dialog-users.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { MatTable } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { DeleteUser, GetUsers } from '../../store-users/users.action';
import { UsersSelectors } from '../../store-users/users.selectors';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { AuthModel, UserFilterModel, UserModel } from '../../../../core/models';
import { AuthService } from '../../../auth/auth.service';
import { RoleEnum } from '../../../../core/enums';


@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public usersService: UsersService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
  }

  // Selectors for accessing state
  @Select(UsersSelectors.getUsersList) users: Observable<UserModel[]>;
  @Select(UsersSelectors.getUsersCounter) usersCounter: Observable<any>;

  @ViewChild(MatTable) table: MatTable<UserModel[]>;
  @ViewChild(MatSort) sort: MatSort;

  // Enum to access route names
  protected readonly RoleEnum = RoleEnum;

  // Current user account information
  currentAccount: AuthModel | null = this.authService.accountValue;

  // Pagination variables
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [3, 5, 10, 15, 20, 25];

  // Table settings
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent: PageEvent;
  disabled = false;

  // Columns to display in the table
  displayedColumns = ['id', 'avatar', 'role', 'email', 'firstName', 'lastName', 'createdAt', 'posts', 'status', 'location', 'birthAt', 'actions'];

  users$ = this.usersService.users$;

  dataLoading: boolean = false;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Sorting settings
  orderByColumn = 'id' as SortDirection;
  orderByDirection = 'asc' as SortDirection;

  // Default user filters
  private defaultUsersFilters: UserFilterModel = { email: '', firstName: '', lastName: '', roles: [] };
  private usersFilters: UserFilterModel = this.defaultUsersFilters;

  ngOnInit(): void {
    this.setRolesForFiltering();
    this.getUsersFilter();
  }

  /**
   * Set roles for filtering based on the current user's role
   */
  public setRolesForFiltering() {
    let roles: number[] | undefined = [];
    const userRole = this.currentAccount?.userInfo?.role;

    if (userRole === RoleEnum.Manager) {
      roles = [RoleEnum.Client];
    } else if (userRole === RoleEnum.ProjectAdmin) {
      roles = [RoleEnum.Client, RoleEnum.Manager];
    } else if (userRole === RoleEnum.SuperAdmin) {
      roles = [RoleEnum.Client, RoleEnum.Manager, RoleEnum.ProjectAdmin, RoleEnum.SuperAdmin];
    }

    this.usersFilters.roles = roles;
    this.defaultUsersFilters.roles = roles;
    this.usersService.usersFilters$.next(this.usersFilters);
  }


  //
  // public setRolesForFiltering() {
  //   if (!this.usersFilters?.roles?.length) {
  //     if (this.currentAccount?.userInfo?.role === RoleEnum.Manager) {
  //       this.usersFilters.roles = [RoleEnum.Client];
  //     } else if (this.currentAccount?.userInfo?.role === RoleEnum.ProjectAdmin) {
  //       this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager];
  //     } else if (this.currentAccount?.userInfo?.role === RoleEnum.SuperAdmin) {
  //       this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager, RoleEnum.ProjectAdmin, RoleEnum.SuperAdmin];
  //     } else {
  //       console.log(888888888888)
  //       this.usersFilters.roles = [];
  //     }
  //     this.usersService.usersFilters$.next(this.usersFilters);
  //   } else {
  //     if (this.currentAccount?.userInfo?.role === RoleEnum.Manager) {
  //       this.usersFilters.roles = [RoleEnum.Client];
  //     } else if (this.currentAccount?.userInfo?.role === RoleEnum.ProjectAdmin) {
  //       this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager];
  //     } else if (this.currentAccount?.userInfo?.role === RoleEnum.SuperAdmin) {
  //       this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager, RoleEnum.ProjectAdmin, RoleEnum.SuperAdmin];
  //     } else {
  //       console.log(888888888888)
  //       this.usersFilters.roles = [];
  //     }
  //     this.defaultUsersFilters.roles = this.usersFilters.roles;
  //     this.usersService.usersFilters$.next(this.defaultUsersFilters);
  //   }
  // }
  //
  //


  // public setRolesForFiltering() {
  //   if (this.currentAccount?.userInfo?.role === RoleEnum.Manager) {
  //     this.usersFilters.roles = [RoleEnum.Client];
  //   } else if (this.currentAccount?.userInfo?.role === RoleEnum.ProjectAdmin) {
  //     this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager];
  //   } else if (this.currentAccount?.userInfo?.role === RoleEnum.SuperAdmin) {
  //     this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager, RoleEnum.ProjectAdmin, RoleEnum.SuperAdmin];
  //   } else {
  //     console.log(888888888888)
  //     this.usersFilters.roles = [];
  //   }
  //   this.defaultUsersFilters.roles = this.usersFilters.roles;
  //   this.usersService.usersFilters$.next(this.defaultUsersFilters);
  // }

  /**
   * Set roles for filtering based on the current user's role
   */
  // private setRolesForFiltering(): void {
  //   const { role } = this.currentAccount?.userInfo || {};
  //   switch (role) {
  //     case RoleEnum.Manager:
  //       this.usersFilters.roles = [RoleEnum.Client];
  //       break;
  //     case RoleEnum.ProjectAdmin:
  //       this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager];
  //       break;
  //     case RoleEnum.SuperAdmin:
  //       this.usersFilters.roles = [RoleEnum.Client, RoleEnum.Manager, RoleEnum.ProjectAdmin, RoleEnum.SuperAdmin];
  //       break;
  //     default:
  //       this.usersFilters.roles = [];
  //       break;
  //   }
  //
  //   console.log('setRolesForFiltering - ', this.usersFilters.roles)
  // }


  /**
   *   Construct parameters for fetching data
   */
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

    // Trigger data loading animation
    this.dataLoading = true;

    // Dispatch action to fetch users from store
    this.store.dispatch(new GetUsers(params));

    // Subscribe to users and usersCounter observables to update data and pagination
    this.users.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.usersService.users$.next(resp);
        if (resp) {
          this.dataLoading = false; // Turn off data loading animation when data is received
        }
      });

    this.usersCounter.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.length = resp;
      });

  }

  /**
   * Subscribe to user filters and fetch data
   * @private
   */
  private getUsersFilter() {
    this.usersService.usersFilters$.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.usersFilters = resp || this.setRolesForFiltering();

        if (!this.usersFilters?.roles?.length) {
          this.setRolesForFiltering();
        }
        this.fetchData();
      });
  }


  // private getUsersFilter() {
  //   this.usersService.usersFilters$.pipe(
  //     takeUntil(this.destroy$))
  //     .subscribe(resp => {
  //       if (!Object.keys(resp).length) {
  //         console.log(111)
  //         this.usersFilters = this.defaultUsersFilters;
  //         // this.setRolesForFiltering();
  //         this.fetchData();
  //       } else {
  //         console.log(222)
  //         this.usersFilters = resp
  //         this.fetchData();
  //       }
  //     });
  // }
  //






  // private getUsersFilter() {
  //   this.usersService.usersFilters$
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(resp => {
  //
  //       console.log('getUsersFilter - ', resp)
  //       this.usersFilters = Object.keys(resp).length ? resp : this.setRolesForFiltering();
  //       this.fetchData();
  //     });
  // }


  // private getUsersFilter() {
  //   this.usersService.usersFilters$.pipe(
  //     takeUntil(this.destroy$))
  //     .subscribe(resp => {
  //       if (
  //         resp.firstName === '' &&
  //         resp.lastName === '' &&
  //         resp.email === '' &&
  //         resp.roles.length === 0
  //       ) {
  //         console.log(111);
  //         // this.usersFilters = this.defaultUsersFilters;
  //         this.setRolesForFiltering();
  //       } else {
  //         console.log(222);
  //         this.usersFilters = resp;
  //       }
  //       this.fetchData();
  //     });
  // }


  // private getUsersFilter() {
  //   this.usersService.usersFilters$.pipe(
  //     takeUntil(this.destroy$))
  //     .subscribe(resp => {
  //       if (
  //         resp.roles.length === 0
  //       ) {
  //         console.log(111);
  //         // this.usersFilters = this.defaultUsersFilters;
  //         this.setRolesForFiltering();
  //       } else {
  //         console.log(222);
  //         this.usersFilters = resp;
  //       }
  //       this.fetchData();
  //     });
  // }



  /**
   * Update sorting parameters and fetch data
   */
  sortData($event: any) {
    this.orderByColumn = $event.active;
    this.orderByDirection = $event.direction;
    this.fetchData();
  }

  /**
   * Handle page change event and fetch data
   */
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchData();
  }

  /**
   * Open dialog to add a new user
   */
  addUser() {
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: { newUser: true }
    });

    // After dialog is closed, render table rows
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.table.renderRows();
      }, 1000)
    });
  }

  /**
   * Open dialog to edit a user
   */
  editUser(id: UserModel) {
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: { id, newUser: false }
    });

    // After dialog is closed, render table rows
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.table.renderRows();
      }, 1000)
    });
  }

  /**
   * Open confirmation dialog before deleting a user
   */
  deleteUser(user: UserModel): void {
    const { id, firstName, avatar } = user;
    const params = { avatar };

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: firstName,
        title: 'Delete user - ',
        okText: 'Delete'
      }
    });

    // After confirmation, delete the user
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
