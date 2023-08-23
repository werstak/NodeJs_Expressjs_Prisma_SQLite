import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
// import { PostsState } from '../../store-posts/posts.state';
import { PostModel } from '../../../../shared/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { Observable } from 'rxjs';
import { GetPosts } from '../../store-posts/posts.action';
import { PostsSelectors } from '../../store-posts/posts.selectors';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(
    public postsService: PostsService,
    public dialog: MatDialog,
    public store: Store
  ) {
  }

  @Select(PostsSelectors.getPostsList) posts: Observable<PostModel[]>;
  // @Select(PostsState.getPostsList) posts: Observable<PostModel[]>;

  posts$ = this.postsService.posts$

  subPosts: any;
  private postsArr: PostModel[] = [];



  // @Select(PostsState.getLazy1Name)
  // public name$: any;


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.store.dispatch(new GetPosts());

    this.subPosts = this.posts.subscribe(resp => {
      this.postsArr = resp;
      this.postsService.posts$.next(resp);
      // console.log('get POSTS', this.postsArr)
    });


    // this.subPosts = this.postsService
    //   .getAllPosts()
    //   .subscribe(resp => {
    //     this.postsArr = resp;
    //     this.postsService.posts$.next(resp);
    //     // console.log(this.postsArr)
    //   });



  }

  addPost() {
    const dialogRef = this.dialog.open(DialogPostsComponent, {
      data: {newPost: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result)

      // setTimeout(() => {
      //   this.table.renderRows();
      // }, 1000)

      // if (result === 1) {
      //   // this.refreshTable();
      //   this.table.renderRows();
      // }
    });
  }


  // trackByFn(index, item) {
  //   return item.id; // unique id corresponding to the item
  // }

}

