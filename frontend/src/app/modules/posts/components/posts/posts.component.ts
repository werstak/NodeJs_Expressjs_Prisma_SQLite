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


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
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

