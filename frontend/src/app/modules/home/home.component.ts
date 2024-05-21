import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Subject } from 'rxjs';
import { AuthUserModel } from '../../core/models';

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

  data: AuthUserModel;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
