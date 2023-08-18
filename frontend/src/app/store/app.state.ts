import {Action, Selector, State, StateContext} from "@ngxs/store";

export interface AppStateModel {
  appName: string;
}

export class SetAppName {
  static readonly type = '[App] SetAppName';

  constructor(public appName: string) {
  }
}

@State<AppStateModel>({name: 'AppState'})
export class AppState {
  @Selector()
  static getAppName(state: AppStateModel): string {
    return state.appName = '77777777777777';
  }

  @Action(SetAppName)
  setHost(ctx: StateContext<AppStateModel>, action: SetAppName) {
    ctx.patchState({
      appName: action.appName,
    });
  }
}
