import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
import { PostModel } from '../../../../shared/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { Observable, ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { GetPosts } from '../../store-posts/posts.action';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { PageEvent } from '@angular/material/paginator';
import { UserFilterModel } from '../../../../shared/models/user-filter.model';
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
  @Select(PostsSelectors.getPostsCounter) postsCounter: Observable<any>;

  dataLoading: boolean = false;

  /**
   pagination variables
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
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  /** Filters */
    // private postsFilters: UserFilterModel;
  private defaultPostsFilters: PostFilterModel = {authors: []};
  private postsFilters: PostFilterModel = this.defaultPostsFilters;


  ngOnInit(): void {
    this.fetchData();
    this.getPostsFilter();
  }

  fetchData() {
    const params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      authors: this.postsFilters.authors
    }

    this.dataLoading = true;
    this.store.dispatch(new GetPosts(params));
    this.postsCounter.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.length = resp;
      });
    this.dataLoading = false;
  }

  private getPostsFilter() {
    this.postsService.postsFilters$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        if (!Object.keys(resp).length) {
          this.postsFilters = this.defaultPostsFilters;
          console.log(888888888, this.postsFilters)
        } else {
          console.log(999999999)
          this.postsFilters = resp
          this.fetchData();
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

  addPost() {
    const dialogRef = this.dialog.open(DialogPostsComponent, {
      data: {newPost: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result)
    });
  }


  // trackByFn(index, item) {
  //   return item.id; // unique id corresponding to the item
  // }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

}

