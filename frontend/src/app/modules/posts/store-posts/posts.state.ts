import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PostModel } from '../../../shared/models/post.model';
import { NotificationService } from '../../../shared/notification.service';
import { PostsService } from '../posts.service';
import { tap } from 'rxjs';
import { AddPost, DeletePost, GetPosts, SetSelectedPost, UpdatePost } from './posts.action';
import * as _ from 'lodash';


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

  // @Selector()
  // static getPostsList(state: PostsStateModel) {
  //   return state.posts;
  // }


  @Action(GetPosts)
  getAllPosts({getState, setState}: StateContext<PostsStateModel>) {
    return this.postsService.fetchPosts().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        posts: result,
      });
    }));
  }

  @Action(SetSelectedPost)
  setSelectedPostId({getState, setState}: StateContext<PostsStateModel>, {payload}: SetSelectedPost) {
    const state = getState();
    setState({
      ...state,
      selectedPost: payload
    });
  }


  @Action(AddPost)
  addPost({getState, patchState}: StateContext<PostsStateModel>, {params, avatar}: AddPost) {
    return this.postsService.addPost1(params, avatar).pipe(tap((result) => {
        this.notificationService.showSuccess('Post created successfully');
        const state = getState();
        patchState({
          posts: [...state.posts, result]
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


  @Action(DeletePost)
  deletePost({getState, setState}: StateContext<PostsStateModel>, {id, params}: DeletePost) {
    return this.postsService.removePost1(id, params).pipe(tap(() => {
        this.notificationService.showSuccess('Post delete successfully');

        const state = getState();
        const filteredArray = state.posts.filter(item => item.id !== id);
        setState({
          ...state,
          posts: filteredArray,
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
