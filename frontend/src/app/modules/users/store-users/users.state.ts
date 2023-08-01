import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AppStateModel } from '../../../store/app.state';
import { SetUsersName } from './users.action';

export interface UsersStateModel extends AppStateModel {
  name: string;
}

// export class SetUsersName {
//   static readonly type = '[App] SetUsersName';
//
//   constructor(public name: string) {
//   }
// }

@State<UsersStateModel>({name: 'UsersState'})
export class UsersState {
  @Selector()
  static getUsersName(state: UsersStateModel): string {
    return state.name;
  }

  @Selector()
  static getAppName(state: UsersStateModel): string {
    return state.appName;
  }

  @Selector()
  static getAppName2(state: AppStateModel): string {
    return state.appName;
  }

  @Action(SetUsersName)
  setHost(ctx: StateContext<UsersStateModel>, action: SetUsersName) {
    ctx.patchState({
      name: action.name,
    });
  }
}
