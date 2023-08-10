import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../../../store/app.state';
import { PostsState } from '../../store-posts/posts.state';
import { SetPostsName } from '../../store-posts/posts.action';
import { UserModel } from '../../../../shared/models/user.model';
import { PostModel } from '../../../../shared/models/post.model';
import { DialogUsersComponent } from '../../../users/dialogs/dialog-users/dialog-users.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';

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


  posts$ = this.postsService.posts$

  subPosts: any;
  private postsArr: PostModel[] = [];



  @Select(AppState.getAppName)
  public appName$: any;

  @Select(PostsState.getLazy1Name)
  public name$: any;


  ngOnInit(): void {
    this.fetchData();
    this.store.dispatch([new SetPostsName('LAZY1')]);

  }

  fetchData() {
    this.subPosts = this.postsService
      .getAllPosts()
      .subscribe(resp => {
        this.postsArr = resp;
        this.postsService.posts$.next(resp);
        console.log(this.postsArr)
      });
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

