import { Selector } from '@ngxs/store';
import { PostsState, PostsStateModel } from './posts.state';

export class PostsSelectors {
  @Selector([PostsState])
  static getPostsList(state: PostsStateModel) {
    return state.posts;
  }

  @Selector([PostsState])
  static getPostsCounter(state: PostsStateModel) {
    return state.postsCounter;
  }

}
