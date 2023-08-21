import {Action, Selector, State, StateContext} from "@ngxs/store";
import { SetPostsName } from './posts.action';
import { Injectable } from '@angular/core';

export interface PostsStateModel {
  name: string;
}

// export class SetPostsName {
//   static readonly type = '[App] SetPostsName';
//
//   constructor(public name: string) {
//   }
// }

@State<PostsStateModel>({name: 'PostsState'})
@Injectable()
export class PostsState {
  @Selector()
  static getLazy1Name(state: PostsStateModel): string {
    return state.name;
  }

  @Action(SetPostsName)
  setHost(ctx: StateContext<PostsStateModel>, action: SetPostsName) {
    ctx.patchState({
      name: action.name,
    });
  }
}
