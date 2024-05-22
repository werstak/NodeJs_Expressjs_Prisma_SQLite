import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { GetStatisticsAction } from '../../store-dashboard/dashboard.action';
import { Observable, Subject } from 'rxjs';
import { StatisticsResponse } from '../../../../core/models';
import { DashboardSelectors } from '../../store-dashboard/dashboard.selectors';
import { roleTransform } from '../../../../shared/utils/role-transform';

@Component({
  selector: 'app-post-statistics',
  templateUrl: './post-statistics.component.html',
  styleUrls: ['./post-statistics.component.scss']
})
export class PostStatisticsComponent implements OnInit, OnDestroy {
  constructor(
    public store: Store
  ) {
  }

  // Selector to get the statistics data from the store
  @Select(DashboardSelectors.getStatisticsAll) statisticsCounters$: Observable<StatisticsResponse>;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Initialize with default values for the statistics data counters
  public statisticsCounters: StatisticsResponse = {
    // Add post counts
    totalPosts: 0,
    postsByRole: [],
    postsByUser: [],
    postsByCategory: [],
    postsByStatus: [],
    // Add user counts
    totalUser: 0,
    usersByRole: [],
    usersByStatus: []
  };

  // Flag to indicate if data is loading
  public dataLoading: boolean = false;

  // Chart Data, Options and Labels for the different charts

  // Post by Category Chart Data
  public categoryPostsChartLabels: string[] = [];
  public categoryPostsChartData: any[] = [];
  public categoryPostsCartOptions: any = {};

  // Post by Role Chart Data
  public rolePostsChartLabels: string[] = [];
  public rolePostsChartData: any[] = [];
  public rolePostsCartOptions: any = {};

  // Post by User Chart Data
  public userPostsChartLabels: string[] = [];
  public userPostsChartData: any[] = [];
  public userPostsCartOptions: any = {};

  // User by Role Chart Data
  public usersByRoleChartLabels: string[] = [];
  public usersByRoleChartData: any[] = [];
  public usersByRoleCartOptions: any = {};

  // User by Status Chart Data
  public usersByStatusChartLabels: string[] = [];
  public usersByStatusChartData: any[] = [];
  public usersByStatusCartOptions: any = {};


  ngOnInit(): void {
    this.fetchStatistics();
  }

  /**
   * Fetch the statistics data from the store
   * @private
   */
  private fetchStatistics(): void {
    this.dataLoading = true;
    this.store.dispatch(new GetStatisticsAction());

    // Subscribe to the statistics data
    this.statisticsCounters$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.statisticsCounters = resp || {
        // Add post counts
        totalPosts: 0,
        postsByRole: [],
        postsByUser: [],
        postsByCategory: [],
        postsByStatus: [],
        // Add user counts
        totalUser: 0,
        usersByRole: [],
        usersByStatus: []
      };
      this.updateCharts();
      this.dataLoading = false;
    });
  }

  /**
   * Get the count of published posts
   * @returns The count of published posts
   */
  public getPublishedPostsCount(): number {
    if (!this.statisticsCounters.postsByStatus) {
      return 0;
    }
    const publishedStatus = this.statisticsCounters.postsByStatus.find(status => status.published);
    return publishedStatus ? publishedStatus.count : 0;
  }

  /**
   * Update the charts with the new data values
   * @private
   */
  private updateCharts(): void {

    // Ensure the properties are defined and have default values
    const postsByCategory = this.statisticsCounters.postsByCategory || [];
    const postsByRole = this.statisticsCounters.postsByRole || [];
    const postsByUser = this.statisticsCounters.postsByUser || [];

    // Category Chart Data
    this.categoryPostsChartLabels = postsByCategory.map(category => category.name);
    this.categoryPostsChartData = [{
      data: postsByCategory.map(category => category._count.posts),
      label: 'Posts by Category'
    }];
    this.categoryPostsCartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Posts by Category'
        }
      }
    }

    // Role Chart Data
    this.rolePostsChartLabels = postsByRole.map(role => roleTransform(role.role));
    this.rolePostsChartData = [{
      data: postsByRole.map(role => role.count),
      label: 'Posts by Role'
    }];
    this.rolePostsCartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Posts by Role'
        }
      }
    }

    // User Chart Data
    this.userPostsChartLabels = postsByUser.map(user => `${user.firstName} ${user.lastName}`);
    this.userPostsChartData = [{
      data: postsByUser.map(user => user._count.posts),
      label: 'Posts by User'
    }];
    this.userPostsCartOptions = {
      responsive: true,
      plugins: {
        colors: {
          enabled: true,
        }
      }
    }

    // User by Role Chart Data
    this.usersByRoleChartLabels = this.statisticsCounters.usersByRole.map(role => roleTransform(role.role));
    this.usersByRoleChartData = [{
      data: this.statisticsCounters.usersByRole.map(role => role.count),
      label: 'Users by Role'
    }];
    this.usersByRoleCartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Users by Role'
        }
      }
    }

    // User by Status Chart Data
    this.usersByStatusChartLabels = this.statisticsCounters.usersByStatus.map(status => status.status ? 'Active' : 'Inactive');
    this.usersByStatusChartData = [{
      data: this.statisticsCounters.usersByStatus.map(status => status.count),
      label: 'Users by Status'
    }];
    this.usersByStatusCartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Users by Status'
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
