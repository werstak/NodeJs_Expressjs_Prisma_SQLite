import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
import { PostModel } from '../../../../shared/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { GetPosts } from '../../store-posts/posts.action';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { PageEvent } from '@angular/material/paginator';
import { PostFilterModel } from '../../../../shared/models/post-filter.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {

  constructor(
    public postsService: PostsService,
    public dialog: MatDialog,
    public store: Store
  ) {
  }

  @Select(PostsSelectors.getPostsList) posts$: Observable<PostModel[]>;
  @Select(PostsSelectors.getPostsCounter) postsCounter$s: Observable<any>;

  dataLoading: boolean = false;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  /** Filters */
  private defaultPostsFilters: PostFilterModel = {authors: [], categories: []};
  private postsFilters: PostFilterModel = this.defaultPostsFilters;

  /**
   Pagination variables
   */
  length = 0;
  pageSize = 2;
  pageIndex = 0;
  pageSizeOptions = [2, 3, 5, 10, 15, 20, 25];
  previousPageIndex = 0;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;

  ngOnInit(): void {
    this.getPostsFilter();
  }

  private getPostsFilter() {
    this.postsService.postsFilters$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        // console.log(1111111111, resp)
        if (!Object.keys(resp).length) {
          this.postsFilters = this.defaultPostsFilters;
        } else {
          this.postsFilters = resp
          this.fetchData();
          // console.log(22222222222)
        }
      });
  }

  private fetchData() {
    this.dataLoading = true;

    const params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      authors: this.postsFilters.authors,
      categories: this.postsFilters.categories
    }

    this.store.dispatch(new GetPosts(params));
    this.postsCounter$s.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.length = resp;
        if (resp) {
          this.dataLoading = false;
        }
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchData();
  }

  trackByFn(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

