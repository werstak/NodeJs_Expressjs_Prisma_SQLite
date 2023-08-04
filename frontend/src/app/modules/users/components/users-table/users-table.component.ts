import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../users.service';
import { UserModel } from '../../../../shared/models/user.model';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsersComponent } from '../../dialogs/dialog-users/dialog-users.component';
import { NotificationService } from '../../../../shared/notification.service';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { MatTable } from '@angular/material/table';
import * as _ from 'lodash';


@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  constructor(
    public usersService: UsersService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {
  }

  displayedColumns = ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'role', 'avatar', 'posts', 'actions'];

  @ViewChild(MatTable) table: MatTable<UserModel>;

  reloadPage$ = new Subject<void>();
  users$ = this.usersService.users$;
  private subUsers: Subscription;

  // dataSource = ELEMENT_DATA;
  // dataSource: UserModel[] = [];
  // public users$ = new BehaviorSubject<UserModel[] | null>([]);


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.subUsers = this.usersService
      .getAllUsers()
      .subscribe(resp => {
        this.usersService.users$.next(resp);
        // this.dataSource = resp;
        // this.users = resp;
        // console.log('get USERS', this.dataSource)
      });
  }


  addUser() {
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: {newUser: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result)
      if (result === 1) {
        this.refreshTable();
        this.table.renderRows();
      }
    });
  }


  editUser(id: UserModel) {
    console.log('edit', id)
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: {id, newUser: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result)

      if (result === 1) {

        // this.refreshTable();
      }
    });
  }


  deleteUser(id: string): void {
    const userId = Number(id);

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Delete user?',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {

        this.usersService.removeUser(userId)
          .pipe(
            // takeUntil(this.unsubscribe)
          )
          .subscribe(
            (response) => {
              console.log('response', response);
              this.notificationService.showSuccess('User delete successfully');
            },
            (error) => {
              console.error(error);
              const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
              const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
              this.notificationService.showError(secondErrorAttempt);
            }
          );

      }
    });
  }


// TODO
  private refreshTable() {
    // this.reloadPage$.next();
  }


  ngOnDestroy() {
    this.subUsers.unsubscribe();
  }

}
