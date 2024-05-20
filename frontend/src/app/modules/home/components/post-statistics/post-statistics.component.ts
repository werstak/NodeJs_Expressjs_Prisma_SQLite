import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { GetPostsCounts } from '../../store-home/posts-counts.action';
import { Observable, Subject } from 'rxjs';
import { PostsSelectors } from '../../../posts/store-posts/posts.selectors';
import { HomeSelectors } from '../../store-home/posts-counts.selectors';

@Component({
  selector: 'app-post-statistics',
  templateUrl: './post-statistics.component.html',
  styleUrls: ['./post-statistics.component.scss']
})
export class PostStatisticsComponent implements OnInit, OnDestroy  {
  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  public length: number;
  constructor(
    public store: Store,
  ) {
  }

  // Selectors for retrieving posts counter from the Ngxs store
  // postsCounter$ = this.store.select(state => state.postsCounts.count);

  @Select(HomeSelectors.getPostsCounts) postsCounters$: Observable<any>;
  // @Select(PostsSelectors.getPostsCounter) postsCounter$: Observable<number>;


  // Flag to indicate whether data is loading
  dataLoading: boolean = false;

  ngOnInit(): void {
    this.fetchPostsCounts();
  }

  /**
   * Fetch posts counts
   */
  private fetchPostsCounts(): void {
    console.log(111, 'fetchPostsCounts')
    this.dataLoading = true;

    this.store.dispatch(new GetPostsCounts());
    // this.store.dispatch(new GetPostsCounts()).pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   this.dataLoading = false;
    // });

    this.postsCounters$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(resp => {
      console.log(555, resp)
      this.length = resp;
      this.dataLoading = false;
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
