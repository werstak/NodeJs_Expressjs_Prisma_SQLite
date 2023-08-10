import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostModel } from '../../../../shared/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { UserModel } from '../../../../shared/models/user.model';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import * as _ from 'lodash';
import { PostsService } from '../../posts.service';
import { NotificationService } from '../../../../shared/notification.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

// export interface DialogData {
//   animal: string;
//   name: string;
// }

export class PostComponent implements OnInit, OnDestroy {

  @Input() post: PostModel;
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;


  animal: string;
  name: string;

  postsArr: PostModel[] = [];
  // private postsArr: PostModel[] = [];


  // currentPost: PostModel;
  // respNewPost: PostModel;
  // respUpdatePost: PostModel;
  private subPosts: Subscription;
  private unsubscribe = new Subject<void>();



  constructor(
    public dialog: MatDialog,
    public postsService: PostsService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
  }


  openDialogEditPost(id: number): void {
    console.log('edit', id)

    const dialogRef = this.dialog.open(DialogPostsComponent, {
      data: {id, newPost: false, name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('111 The dialog was closed', result);
      this.animal = result;
    });
  }


  openDialogDeletePost(post: PostModel): void {
    this.getPosts();

    let {id, title} = post;

    console.log('DIALOG dell post', post)

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
        this.postsService.removePost(id)
          .pipe(
            // takeUntil(this.unsubscribe)
          )
          .subscribe(
            (response) => {
              console.log(' deletePost - response', response);
              this.deletePostInList(id);
              this.notificationService.showSuccess('Post delete successfully');
            },
            (error) => {
              console.error(error);
              const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
              const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
              this.notificationService.showError(secondErrorAttempt);
            }
          );

      } else {
        return
      }


    });
  }

  private getPosts(): void {
    this.postsService.posts$.subscribe((posts) => {
      this.postsArr = posts;
      console.log('1 getUsers  = postsArr', this.postsArr)
    });
  }

  private deletePostInList(id: number) {
    let newPosArr = this.postsArr.filter(n => n.id !== id);
    this.postsService.posts$.next(newPosArr);
  }

  ngOnDestroy(): void {
    // this.unsubscribe.next();
    // this.unsubscribe.complete();
  }

}
