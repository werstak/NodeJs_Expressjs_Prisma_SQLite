import { Selector } from '@ngxs/store';
import { PostsState, PostsStateModel } from './posts.state';
import { GetListAllUsers } from './posts.action';

export class PostsSelectors {

  @Selector([PostsState])
  static getPostsList(state: PostsStateModel) {
    return state.posts;
  }

  @Selector([PostsState])
  static getPostsCounter(state: PostsStateModel) {
    return state.postsCounter;
  }

  /**
   USERS list
   */
  @Selector([PostsState])
  static getListUsers(state: PostsStateModel) {
    return state.usersList;
  }

  /**
   CATEGORIES of posts
   */
  @Selector([PostsState])
  static getListCategories(state: PostsStateModel) {
    return state.categories;
  }

}
