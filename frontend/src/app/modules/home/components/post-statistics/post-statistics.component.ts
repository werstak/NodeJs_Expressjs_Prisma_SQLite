import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { GetPostsCounts } from '../../store-home/posts-counts.action';
import { Observable, Subject } from 'rxjs';
import { PostsCountsModel } from '../../../../core/models';
import { HomeSelectors } from '../../store-home/posts-counts.selectors';

@Component({
  selector: 'app-post-statistics',
  templateUrl: './post-statistics.component.html',
  styleUrls: ['./post-statistics.component.scss']
})
export class PostStatisticsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  // Posts Counters Model to store the posts counts
  public postsCounters: PostsCountsModel = {
    totalPosts: 0,
    postsByRole: [],
    postsByUser: [],
    postsByCategory: [],
    postsByStatus: []
  };
  // Flag to indicate if data is loading
  public dataLoading: boolean = false;

  @Select(HomeSelectors.getPostsCounts) postsCounters$: Observable<PostsCountsModel>;

  // Chart Options for the different charts in the component
  public chartOptions: any = {
    responsive: true,
  };

  // Chart Data and Labels for the different charts in the component
  public categoryChartLabels: string[] = [];
  public categoryChartData: any[] = [];

  public roleChartLabels: string[] = [];
  public roleChartData: any[] = [];

  public userChartLabels: string[] = [];
  public userChartData: any[] = [];

  constructor(public store: Store) {}

  ngOnInit(): void {
    this.fetchPostsCounts();
  }

  /**
   * Fetch the posts counts from the store and update the charts with the new data values
   * @private
   */
  private fetchPostsCounts(): void {
    this.dataLoading = true;
    this.store.dispatch(new GetPostsCounts());

    this.postsCounters$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.postsCounters = resp || {
        totalPosts: 0,
        postsByRole: [],
        postsByUser: [],
        postsByCategory: [],
        postsByStatus: []
      };
      this.updateCharts();
      this.dataLoading = false;
    });
  }

  /**
   * Update the charts with the new data values
   * @private
   */
  private updateCharts(): void {
    // Ensure the properties are defined and have default values
    const postsByCategory = this.postsCounters.postsByCategory || [];
    const postsByRole = this.postsCounters.postsByRole || [];
    const postsByUser = this.postsCounters.postsByUser || [];

    // Category Chart
    this.categoryChartLabels = postsByCategory.map(category => category.name);
    this.categoryChartData = [{ data: postsByCategory.map(category => category._count.posts), label: 'Posts by Category' }];

    // Role Chart
    this.roleChartLabels = postsByRole.map(role => `Role ${role.role}`);
    this.roleChartData = [{ data: postsByRole.map(role => role.count), label: 'Posts by Role' }];

    // User Chart
    this.userChartLabels = postsByUser.map(user => `${user.firstName} ${user.lastName}`);
    this.userChartData = [{ data: postsByUser.map(user => user._count.posts), label: 'Posts by User' }];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
