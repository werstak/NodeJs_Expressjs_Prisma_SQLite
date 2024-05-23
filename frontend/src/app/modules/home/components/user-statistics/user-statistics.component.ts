import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { DashboardSelectors } from '../../store-dashboard/dashboard.selectors';
import { Observable, Subject } from 'rxjs';
import { StatisticsResponse } from '../../../../core/models';
import { takeUntil } from 'rxjs/operators';
import { roleTransform } from '../../../../shared/utils/role-transform';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss']
})
export class UserStatisticsComponent implements OnInit, OnDestroy {
  // Selector to get the statistics data from the store
  @Select(DashboardSelectors.getStatisticsAll) statisticsUsers$: Observable<StatisticsResponse>;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Flag to indicate if data is loading
  public dataLoading: boolean = false;

  // Initialize with default values for the statistics data counters
  public statisticsUsers: StatisticsResponse = {
    totalUser: 0,
    usersByRole: [],
    usersByStatus: []
  };

  // User by Role Chart Data
  public usersByRoleChartLabels: string[] = [];
  public usersByRoleChartData: any[] = [];
  public usersByRoleCartOptions: any = {};

  // User by Status Chart Data
  public usersByStatusChartLabels: string[] = [];
  public usersByStatusChartData: any[] = [];
  public usersByStatusCartOptions: any = {};


  ngOnInit(): void {
    this.fetchUsersStatistics();
  }

  /**
   * Fetch the statistics data for users
   * @private
   */
  private fetchUsersStatistics(): void {
    this.dataLoading = true;
    this.statisticsUsers$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.statisticsUsers = resp || {
        totalUser: 0,
        usersByRole: [],
        usersByStatus: []
      };
      this.updateUsersCharts();
      this.dataLoading = false;
    });
  }

  /**
   * Update the charts with the data from the statistics
   * @private
   */
  private updateUsersCharts(): void {

    // Ensure the properties are defined and have default values
    const usersByRole = this.statisticsUsers.usersByRole || [];
    const usersByStatus = this.statisticsUsers.usersByStatus || [];

    // User by Role Chart Data
    this.usersByRoleChartLabels = usersByRole.map(role => roleTransform(role.role));
    this.usersByRoleChartData = [{
      data: usersByRole.map(role => role.count),
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
    this.usersByStatusChartLabels = usersByStatus.map(status => status.status ? 'Active' : 'Inactive');
    this.usersByStatusChartData = [{
      data: usersByStatus.map(status => status.count),
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
