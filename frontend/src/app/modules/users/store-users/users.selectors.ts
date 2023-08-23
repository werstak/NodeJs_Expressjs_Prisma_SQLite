import { Selector } from '@ngxs/store';
import { UsersState, UsersStateModel } from './users.state';

export class UsersSelectors {
  @Selector([UsersState])
  static getUsersList(state: UsersStateModel) {
    return state.users;
  }

}
