import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AppStateModel } from '../../../store/app.state';
import { AddUser, DeleteUser, GetUsers, SetSelectedUser, UpdateUser } from './users.action';
import { UserModel } from '../../../shared/models/user.model';
import { UsersService } from '../users.service';
import { tap } from 'rxjs';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NotificationService } from '../../../shared/notification.service';

// export interface UsersStateModel extends AppStateModel {
//   name: string;
// }


export class UsersStateModel {
  users: UserModel[];
  selectedUser?: any;
}

@State<UsersStateModel>({
  name: 'UsersState',
  defaults: {
    users: [],
    selectedUser: null
  }
})


@Injectable()
export class UsersState {
  constructor(
    private usersService: UsersService,
    private notificationService: NotificationService,
  ) {
  }


  @Selector()
  static getUsersList(state: UsersStateModel) {
    return state.users;
  }


  @Action(GetUsers)
  getUsers({getState, setState}: StateContext<UsersStateModel>) {
    return this.usersService.fetchUsers().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        users: result,
      });
    }));
  }


  @Action(SetSelectedUser)
  setSelectedUserId({getState, setState}: StateContext<UsersStateModel>, {payload}: SetSelectedUser) {
    const state = getState();
    setState({
      ...state,
      selectedUser: payload
    });
  }


  @Action(AddUser)
  addUser({getState, patchState}: StateContext<UsersStateModel>, {params, avatar}: AddUser) {
    return this.usersService.addUser1(params, avatar).pipe(tap((result) => {
        this.notificationService.showSuccess('User created successfully');
        const state = getState();
        patchState({
          users: [...state.users, result]
        });
      },
      (error) => {
        console.error(error);
        const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
        const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
        this.notificationService.showError(secondErrorAttempt);
      }
    ));
  }


  @Action(UpdateUser)
  updateUser({getState, setState}: StateContext<UsersStateModel>, {
    id,
    params,
    avatar,
    imageOrUrl,
    previousImageUrl
  }: UpdateUser) {
    return this.usersService.updateUser1(id, params, avatar, imageOrUrl, previousImageUrl).pipe(tap((result) => {
        this.notificationService.showSuccess('User updated successfully');
        const state = getState();
        const usersList = [...state.users];
        const userIndex = usersList.findIndex(item => item.id === id);
        usersList[userIndex] = result;
        setState({
          ...state,
          users: usersList,
        });
      },
      (error) => {
        console.error(error);
        const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
        const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
        this.notificationService.showError(secondErrorAttempt);
      }
    ));
  }


  @Action(DeleteUser)
  deleteUser({getState, setState}: StateContext<UsersStateModel>, {id, params}: DeleteUser) {
    return this.usersService.removeUser1(id, params).pipe(tap(() => {
        this.notificationService.showSuccess('User delete successfully');

        const state = getState();
        const filteredArray = state.users.filter(item => item.id !== id);
        setState({
          ...state,
          users: filteredArray,
        });
      },
      (error) => {
        console.error(error);
        const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
        const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
        this.notificationService.showError(secondErrorAttempt);
      }
    ));
  }



}
