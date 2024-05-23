import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Subject } from 'rxjs';
import { AuthUserModel } from '../../core/models';
import { GetStatisticsAction } from './store-dashboard/dashboard.action';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store
  ) {
  }


  // Flag to indicate if data is loading
  public dataLoading: boolean = false;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  data: AuthUserModel;

  ngOnInit(): void {
    this.dataLoading = true;
    this.fetchStatistics();
    this.dataLoading = false;
  }



  private fetchStatistics() {
    this.store.dispatch(new GetStatisticsAction());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
