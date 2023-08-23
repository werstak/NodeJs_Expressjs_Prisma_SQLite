import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
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

  @Select(PostsSelectors.getPostsList) posts$: Observable<PostModel[]>;


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.store.dispatch(new GetPosts());
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

}

