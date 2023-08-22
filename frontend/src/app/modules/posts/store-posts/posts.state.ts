import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PostModel } from '../../../shared/models/post.model';
import { NotificationService } from '../../../shared/notification.service';
import { PostsService } from '../posts.service';
import { tap } from 'rxjs';
import { GetPosts, SetSelectedPost, UpdatePost } from './posts.action';
import { AddUser, SetSelectedUser, UpdateUser } from '../../users/store-users/users.action';
import * as _ from 'lodash';
import { UsersStateModel } from '../../users/store-users/users.state';


export class PostsStateModel {
  posts: PostModel[];
  selectedPost?: any;
}

@State<PostsStateModel>({
  name: 'PostsState',
  defaults: {
    posts: [],
    selectedPost: null
  }
})


@Injectable()
export class PostsState {
  constructor(
    private postsService: PostsService,
    private notificationService: NotificationService,
  ) {
  }

  @Selector()
  static getPostsList(state: PostsStateModel) {
    return state.posts;
  }


  @Action(GetPosts)
  getTodos({getState, setState}: StateContext<PostsStateModel>) {
    return this.postsService.fetchPosts().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        posts: result,
      });
    }));
  }

  // id, params, picture, pictureOrUrl, previousPictureUrl
  @Action(SetSelectedPost)
  setSelectedPostId({getState, setState}: StateContext<PostsStateModel>, {payload}: SetSelectedPost) {
    const state = getState();
    setState({
      ...state,
      selectedPost: payload
    });
  }


  @Action(UpdatePost)
  updatePost({getState, setState}: StateContext<PostsStateModel>, {
    id, params, picture, pictureOrUrl, previousPictureUrl
  }: UpdatePost) {
    return this.postsService.updatePost1(id, params, picture, pictureOrUrl, previousPictureUrl).pipe(tap((result) => {
        this.notificationService.showSuccess('Post updated successfully');
        const state = getState();
        const postsList = [...state.posts];
        const postIndex = postsList.findIndex(item => item.id === id);
        postsList[postIndex] = result;
        setState({
          ...state,
          posts: postsList,
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
