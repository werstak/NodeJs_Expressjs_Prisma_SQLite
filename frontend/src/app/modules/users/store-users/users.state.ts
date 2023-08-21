import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AppStateModel } from '../../../store/app.state';
import { GetUsers, SetSelectedUser, UpdateUser } from './users.action';
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
  getTodos({getState, setState}: StateContext<UsersStateModel>) {
    return this.usersService.fetchUsers().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        users: result,
      });
    }));
  }


  @Action(SetSelectedUser)
  setSelectedTodoId({getState, setState}: StateContext<UsersStateModel>, {payload}: SetSelectedUser) {
    const state = getState();
    setState({
      ...state,
      selectedUser: payload
    });
  }

  @Action(UpdateUser)
  updateTodo({getState, setState}: StateContext<UsersStateModel>, {
    id,
    params,
    avatar,
    imageOrUrl,
    previousImageUrl
  }: UpdateUser) {
    return this.usersService.updateUser1(id, params, avatar, imageOrUrl, previousImageUrl).pipe(
      tap((result) => {

          console.log('RESPONSE Update User', result);
          this.notificationService.showSuccess('User updated successfully');

          const state = getState();
          const usersList = [...state.users];
          const todoIndex = usersList.findIndex(item => item.id === id);
          usersList[todoIndex] = result;
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


  //
  // @Action(UpdateUser)
  // updateTodo({getState, setState}: StateContext<UsersStateModel>, {id, params, avatar, imageOrUrl, previousImageUrl}: UpdateUser) {
  //   return this.usersService.updateUser1(id, params, avatar, imageOrUrl, previousImageUrl).pipe(tap((result) => {
  //     const state = getState();
  //     const usersList = [...state.users];
  //     const todoIndex = usersList.findIndex(item => item.id === id);
  //     usersList[todoIndex] = result;
  //     setState({
  //       ...state,
  //       users: usersList,
  //     });
  //   }));
  // }
  //


  // @Selector()
  // static getUsersName(state: UsersStateModel): string {
  //   return state.name;
  // }
  //
  // @Selector()
  // static getAppName(state: UsersStateModel): string {
  //   return state.appName;
  // }

  // @Selector()
  // static getAppName2(state: AppStateModel): string {
  //   return state.appName;
  // }

  // @Action(SetUsersName)
  // setHost(ctx: StateContext<UsersStateModel>, action: SetUsersName) {
  //   ctx.patchState({
  //     name: action.name,
  //   });
  // }


}
