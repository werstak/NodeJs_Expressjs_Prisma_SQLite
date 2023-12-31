import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostModel } from '../../../../core/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { PostsService } from '../../posts.service';
import { Store } from '@ngxs/store';
import { DeletePost } from '../../store-posts/posts.action';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})


export class PostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel;

  constructor(
    public store: Store,
    public dialog: MatDialog,
    public postsService: PostsService,
  ) {
  }

  ngOnInit(): void {
  }

  openDialogEditPost(id: number): void {
    const dialogRef = this.dialog.open(DialogPostsComponent, {
      data: {id, newPost: false},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  openDialogDeletePost(post: PostModel): void {
    let {id, title, picture} = post;
    const params = {
      picture
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: title,
        title: 'Delete post - ',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('deletePost - afterClosed', result)
      if (result === true) {
        this.store.dispatch(new DeletePost(id, params));
      } else {
        return;
      }
    });
  }

  ngOnDestroy(): void {
  }
}
