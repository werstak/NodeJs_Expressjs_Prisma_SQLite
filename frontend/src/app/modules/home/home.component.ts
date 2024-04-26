import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { GetCategories } from '../posts/store-posts/posts.action';
import { Subject, takeUntil } from 'rxjs';
import { Account } from '../../core/models/account';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    public homeService: HomeService
  ) {
  }

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  data: Account;

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetches data from the HomeService
   */
  private fetchData() {
    this.homeService.getData().pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.data = resp;
        // console.log(this.data)
      });
  }
}
