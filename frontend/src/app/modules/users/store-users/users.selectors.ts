import { Selector } from '@ngxs/store';
import { UsersState, UsersStateModel } from './users.state';

export class UsersSelectors {
  @Selector([UsersState])
  static getUsersList(state: UsersStateModel) {
    return state.users;
  }

  @Selector([UsersState])
  static getUsersCounter(state: UsersStateModel) {
    return state.usersCounter;
  }
}
