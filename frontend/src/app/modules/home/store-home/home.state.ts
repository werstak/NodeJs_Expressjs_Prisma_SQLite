import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services';
import { HomeService } from '../home.service';

import { tap } from 'rxjs';
import { PostsCountsModel } from '../../../core/models';
import { GetPostsCounts } from './posts-counts.action';


/**
 * Define the structure of the HomeStateModel
 */
export class HomeStateModel {
  postsCounts: PostsCountsModel[];
}

/**
 * Decorator for defining a state class
 */
@State<HomeStateModel>({
  name: 'HomeState',
  defaults: {
    postsCounts: [],
  }
})

@Injectable()
export class HomeState {

  constructor(
    private homeService: HomeService,
    private notificationService: NotificationService,
  ) {
  }

  /**
   * Action to get all posts counts
   */
  @Action(GetPostsCounts)
  getAllPostsCounts({getState, setState}: StateContext<HomeStateModel>) {
    console.log(333, 'GetPostsCounts')
    return this.homeService.getPostsCounts().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          postsCounts: result,
        });
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(error);
      }));
  }
}

