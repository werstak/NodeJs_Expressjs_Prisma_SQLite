import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../users.service';
import { UserModel } from '../../../../shared/models/user.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsersComponent } from '../../dialogs/dialog-users/dialog-users.component';
import { NotificationService } from '../../../../shared/notification.service';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { MatTable } from '@angular/material/table';
import * as _ from 'lodash';
import { Select, Store } from '@ngxs/store';
import { DeleteUser, GetUsers, UpdateUser } from '../../store-users/users.action';
import { UsersState } from '../../store-users/users.state';
import { UsersSelectors } from '../../store-users/users.selectors';


@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  constructor(
    public store: Store,
    public usersService: UsersService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {
  }

  @Select(UsersSelectors.getUsersList) users: Observable<UserModel[]>;
  // @Select(UsersState.getUsersList) users: Observable<UserModel[]>;
  @ViewChild(MatTable) table: MatTable<UserModel[]>;

  displayedColumns = ['id', 'avatar', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'role', 'posts', 'actions'];

  reloadPage$ = new Subject<void>();
  users$ = this.usersService.users$;
  private subUsers: Subscription;
  private usersArr: UserModel[] = [];


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.store.dispatch(new GetUsers());

    this.subUsers = this.users.subscribe(resp => {
      this.usersArr = resp;
      this.usersService.users$.next(resp);
    });
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
      //   // this.refreshTable();
      //   this.table.renderRows();
      // }
    });
  }


  editUser(id: UserModel) {
    console.log('edit', id)
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: {id, newUser: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('EDIT dialogRef result', result)

      setTimeout(() => {
        this.table.renderRows();
      }, 1000)

      // if (result === 1) {
      //   // this.refreshTable();
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


// TODO
  private refreshTable() {
    // this.reloadPage$.next();
  }


  ngOnDestroy() {
    this.subUsers.unsubscribe();
  }


}
