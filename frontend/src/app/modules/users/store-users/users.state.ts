import { Action, State, StateContext } from '@ngxs/store';
import { AddUser, DeleteUser, GetUsers, SetSelectedUser, UpdateUser, UpdateUserPassword } from './users.action';
import { UserModel } from '../../../core/models/user.model';
import { UsersService } from '../users.service';
import { tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import * as _ from 'lodash';
import { UpdateCategory } from '../../posts/store-posts/posts.action';
import { PostsStateModel } from '../../posts/store-posts/posts.state';


export class UsersStateModel {
  users: UserModel[];
  usersCounter?: any;
  selectedUser?: UserModel | null;
}

@State<UsersStateModel>({
  name: 'UsersState',
  defaults: {
    users: [],
    usersCounter: null,
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

  @Action(GetUsers)
  getAllUsers({getState, setState}: StateContext<UsersStateModel>, {params}: GetUsers) {
    return this.usersService.fetchUsers(params).pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        users: result.users,
        usersCounter: result.totalCount,
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
  addNewUser({getState, patchState}: StateContext<UsersStateModel>, {params, avatar}: AddUser) {
    return this.usersService.addUser(params, avatar).pipe(tap((result) => {
        this.notificationService.showSuccess('User created successfully');
        const state = getState();
        patchState({
          users: [...state.users, result.newUser],
          usersCounter: result.totalCount,
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
  updateCurrentsUser({getState, setState}: StateContext<UsersStateModel>, {
    id,
    params,
    avatar,
    imageOrUrl,
    previousImageUrl
  }: UpdateUser) {
    return this.usersService.updateUser(id, params, avatar, imageOrUrl, previousImageUrl).pipe(tap((result) => {
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

  @Action(UpdateUserPassword)
  updateUserPassword({getState, setState}: StateContext<UsersStateModel>, {
    id, params
  }: UpdateUserPassword) {
    return this.usersService.updateUserPassword(id, params).pipe(tap((result) => {
        this.notificationService.showSuccess('User password updated successfully');
        console.log(result);
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
    return this.usersService.removeUser(id, params).pipe(tap((result) => {
        this.notificationService.showSuccess('User delete successfully');
        const state = getState();
        const filteredArray = state.users.filter(item => item.id !== id);
        setState({
          ...state,
          users: filteredArray,
          usersCounter: state.usersCounter -1
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
