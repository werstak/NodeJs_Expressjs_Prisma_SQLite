import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostModel } from '../../../../shared/models/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UserModel } from '../../../../shared/models/user.model';
import { UsersService } from '../../../users/users.service';
import { NotificationService } from '../../../../shared/notification.service';
import { PostsService } from '../../posts.service';
import * as _ from 'lodash';
// import { DialogData } from '../../components/post/post.component';

@Component({
  selector: 'app-dialogs-posts',
  templateUrl: './dialog-posts.component.html',
  styleUrls: ['./dialog-posts.component.scss']
})

// export class DialogPostsComponent {
//
//   constructor(
//     public dialogRef: MatDialogRef<DialogPostsComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData
//   ) {
//   }
//
//   // onNoClick(): void {
//   //   this.dialogRef.close();
//   // }
// }


export class DialogPostsComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DialogPostsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private fb: FormBuilder,
    public postsService: PostsService,
    private notificationService: NotificationService,
  ) {}

  public postForm: FormGroup;
  private subPost: Subscription;
  private unsubscribe = new Subject<void>();
  private postsArr: PostModel[] = [];

  currentPost: PostModel;
  respNewPost: PostModel;
  respUpdatePost: PostModel;

  avatarUrl: any;
  avatarImage = '';
  avatarImageDefault: any;


  ngOnInit() {
    this.getPosts();
    this.buildForm();

    console.log('DIALOG  data', this.data)

    if (this.data.newPost == true) {
      this.postForm.reset();
      this.postForm.patchValue({
        published: true
      });
    } else {
      this.initPostFormValue();
    }

  }

  private getPosts(): void {
    this.postsService.posts$.subscribe((posts) => {
      this.postsArr = posts;
      console.log('1 getUsers  = postsArr', this.postsArr)
    });
  }


  private buildForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      content: ['', []],
      published: ['', []],
      picture: ['', []]
    });
  }


  private initPostFormValue() {
    const id: number = this.data.id;
    this.subPost = this.postsService.getPost(id).subscribe(data => {

      this.currentPost = data
      console.log('getUser()', this.currentPost)

      this.postForm.setValue({
        title: data.title,
        description: data.description,
        content: data.content,
        published: data.published,
        picture: '',
      });
    });
  }



  /** Picture upload */
  handleImageLoaded(event: any) {
    if (event.target.files && event.target.files[0]) {
      const files = event.target.files;
      let invalidFlag = false;
      const pattern = /image-*/;
      for (const file of files) {
        if (!file.type.match(pattern)) {
          invalidFlag = true;
          alert('invalid format');
        }
      }
      console.log(1111111111, files)

      this.handleImagePreview(files);
    }
  }

  handleImagePreview(files: any): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // console.log(444444444, event.target.result);
      this.avatarUrl = event.target.result;
    }
    this.avatarImage = files[0];
    // console.log(55555, this.avatarImage);
    reader.readAsDataURL(files[0]);
  }

  /** Delete picture */
  public deleteAvatar() {
    this.avatarUrl = '';
    this.avatarImage = '';
  }


  onSubmitPost(): void {
    if (this.data.newPost == true) {
      this.addNewPost();
    } else {
      this.updatePost();
    }
  }

  private addNewPost(): void {
    if (this.postForm.invalid) {
      return;
    }
    console.log(1, 'onSubmit()', this.postForm.value)

    // let {id, userId} = this.currentPost

    const params: any = {
      // id: id,
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      content: this.postForm.value.content,
      published: this.postForm.value.published,
      picture: this.postForm.value.picture,
      userId: 1
    };

    this.postsService.addPost(params)
      .pipe(
        // takeUntil(this.unsubscribe)
      )
      .subscribe(
        (response) => {
          this.respNewPost = response;
          console.log('respNewPost response', response);
          this.addNewPostInList();
          this.notificationService.showSuccess('Post created successfully');
        },
        (error) => {
          console.error(error);
          const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
          const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
          this.notificationService.showError(secondErrorAttempt);
        }
      );
  }


  private addNewPostInList() {
    this.postsArr.push(this.respNewPost);
    console.log('usersArr', this.postsArr)
    this.postsService.posts$.next(this.postsArr);
  }


  private updatePost(): void {
    if (this.postForm.invalid) {
      return;
    }
    console.log(1, 'onSubmit()', this.postForm.value)

    let {id, userId} = this.currentPost

    const params: any = {
      id: id,
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      content: this.postForm.value.content,
      published: this.postForm.value.published,
      picture: this.postForm.value.picture,
      userId: userId
    };

    this.postsService.updatePost(this.currentPost.id, params)
      .pipe(
        // takeUntil(this.unsubscribe)
      )
      .subscribe(
        (response) => {
          this.respUpdatePost = response;
          console.log('RESPONSE Update Post', response);
          this.updateListPosts(id);
          this.notificationService.showSuccess('Post updated successfully');
        },
        (error) => {
          console.error(error);
          const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
          const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
          this.notificationService.showError(secondErrorAttempt);
        }
      );
  }



  private updateListPosts(id: number) {
    console.log('updateListPosts - usersArr', this.postsArr)

    const updatePostsArr = this.postsArr.map(item => {
      if (item.id === id) {
        item = this.respUpdatePost;
        return item;
      }
      return item;
    });
    console.log('updateUsersArr', updatePostsArr)
    this.postsService.posts$.next(updatePostsArr);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();

    // this.unsubscribe.next();
    // this.unsubscribe.complete();
  }

  // onSubmit() {
  //
  // }
}

