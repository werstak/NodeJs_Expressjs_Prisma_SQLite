import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PostModel } from '../../../shared/models/post.model';
import { NotificationService } from '../../../shared/notification.service';
import { PostsService } from '../posts.service';
import { tap } from 'rxjs';
import {
  AddCategory,
  AddPost, DeleteCategory,
  DeletePost,
  GetCategories,
  GetListAllUsers,
  GetPosts,
  SetSelectedPost, UpdateCategory,
  UpdatePost
} from './posts.action';
import * as _ from 'lodash';
import { UserListModel } from '../../../shared/models/user-list.model';
import { CategoriesModel } from '../../../../../../backend/src/models/categories.model';


export class PostsStateModel {
  posts: PostModel[];
  postsCounter?: any;
  selectedPost?: any;
  usersList: UserListModel[];
  categories: CategoriesModel[];
}

@State<PostsStateModel>({
  name: 'PostsState',
  defaults: {
    posts: [],
    postsCounter: null,
    selectedPost: null,
    usersList: [],
    categories: [],
  }
})


@Injectable()
export class PostsState {

  constructor(
    private postsService: PostsService,
    private notificationService: NotificationService,
  ) {
  }

  /**
   POSTS
   */
  @Action(GetPosts)
  getAllPosts({getState, setState}: StateContext<PostsStateModel>, {params}: GetPosts) {
    return this.postsService.fetchPosts(params).pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        posts: result.posts,
        postsCounter: result.totalCount
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
  addNewPost({getState, patchState}: StateContext<PostsStateModel>, {params, avatar}: AddPost) {
    return this.postsService.addPost(params, avatar).pipe(tap((result) => {
        this.notificationService.showSuccess('Post created successfully');
        const state = getState();
        patchState({
          posts: [...state.posts, result.newPost],
          postsCounter: result.totalCount
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
  updateCurrentPost({getState, setState}: StateContext<PostsStateModel>, {
    id, params, picture, pictureOrUrl, previousPictureUrl
  }: UpdatePost) {
    return this.postsService.updatePost(id, params, picture, pictureOrUrl, previousPictureUrl).pipe(tap((result) => {
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
    return this.postsService.removePost(id, params).pipe(tap(() => {
        this.notificationService.showSuccess('Post delete successfully');

        const state = getState();
        const filteredArray = state.posts.filter(item => item.id !== id);
        setState({
          ...state,
          posts: filteredArray,
          postsCounter: state.postsCounter -1
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

  /**
   USERS list All
   */
  @Action(GetListAllUsers)
  getListAllUsers({getState, setState}: StateContext<PostsStateModel>) {
    return this.postsService.fetchListAllUsers().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        usersList: result.users
      });
    }));
  }

  /**
   CATEGORIES of posts
   */
  @Action(GetCategories)
  getListCategories({getState, setState}: StateContext<PostsStateModel>) {
    return this.postsService.fetchListCategories().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        categories: result.categories
      });
    }));
  }

  @Action(AddCategory)
  addNewCategory({getState, patchState}: StateContext<PostsStateModel>, {params}: AddCategory) {
    return this.postsService.addCategory(params).pipe(tap((result) => {
        this.notificationService.showSuccess('Category created successfully');
        const state = getState();
        patchState({
          categories: [...state.categories, result.newCategory],
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


  @Action(UpdateCategory)
  updateCurrentCategory({getState, setState}: StateContext<PostsStateModel>, {
    id, params
  }: UpdateCategory) {
    return this.postsService.updateCategory(id, params).pipe(tap((result) => {
        this.notificationService.showSuccess('Category updated successfully');
        const state = getState();
        const categoriesList = [...state.categories];
        const postIndex = categoriesList.findIndex(item => item.id === id);
        categoriesList[postIndex] = result;
        setState({
          ...state,
          categories: categoriesList,
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

  @Action(DeleteCategory)
  deleteCategory({getState, setState}: StateContext<PostsStateModel>, {id}: DeleteCategory) {
    return this.postsService.removeCategory(id).pipe(tap(() => {
        this.notificationService.showSuccess('Category delete successfully');

        const state = getState();
        const filteredArray = state.categories.filter(item => item.id !== id);
        setState({
          ...state,
          categories: filteredArray
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
