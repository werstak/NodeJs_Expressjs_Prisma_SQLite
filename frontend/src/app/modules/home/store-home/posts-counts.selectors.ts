import { Selector } from '@ngxs/store';
import { HomeState, HomeStateModel } from './home.state';

/**
 * Selector class for accessing state data related to home.
 */
export class HomeSelectors {

  /**
   * Retrieves the list of posts counts from the state.
   * @returns The list of posts counts.
   */
  @Selector([HomeState])
  static getPostsCounts(state: HomeStateModel) {
    return state.postsCounts;
  }
}
