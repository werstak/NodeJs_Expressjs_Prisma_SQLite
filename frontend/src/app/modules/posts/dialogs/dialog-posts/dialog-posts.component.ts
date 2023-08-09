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
  private postsArr: UserModel[] = [];

  currentPost: PostModel;
  respNewPost: PostModel;
  respUpdatePost: PostModel;



  ngOnInit() {
    this.getPosts();
    this.buildForm();

    console.log('DIALOG  data', this.data)

    if (this.data.newPost == true) {
      this.postForm.reset();
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
      content: ['', [Validators.required]],
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


  onSubmitPost(): void {
    if (this.data.newPost == true) {
      // this.addNewUser();
    } else {
      this.updatePost();
    }
  }

  // private addNewUser(): void {
  //   if (this.editUserForm.invalid) {
  //     return;
  //   }
  //   console.log(1, 'onSubmit()', this.editUserForm.value)
  //
  //   const params: any = {
  //     email: this.editUserForm.value.email,
  //     password: this.editUserForm.value.password,
  //     firstName: this.editUserForm.value.firstName,
  //     lastName: this.editUserForm.value.lastName,
  //     // role: this.editUserForm.value.role,
  //     role: Number(this.editUserForm.value.role),
  //     avatar: this.editUserForm.value.avatar,
  //   };
  //
  //   this.usersService.addUser(params)
  //     .pipe(
  //       // takeUntil(this.unsubscribe)
  //     )
  //     .subscribe(
  //       (response) => {
  //         this.respNewUser = response;
  //         console.log('addNewUser response', response);
  //         this.addNewUserInTable();
  //         this.notificationService.showSuccess('User created successfully');
  //       },
  //       (error) => {
  //         console.error(error);
  //         const firstErrorAttempt: string = _.get(error, 'error.error.message', 'An error occurred');
  //         const secondErrorAttempt: string = _.get(error, 'error.message', firstErrorAttempt);
  //         this.notificationService.showError(secondErrorAttempt);
  //       }
  //     );
  // }
  //
  //
  // private addNewUserInTable() {
  //   this.usersArr.push(this.respNewUser);
  //   console.log('usersArr', this.usersArr)
  //   this.usersService.users$.next(this.usersArr);
  // }


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
          // this.updateUserInTable(id);
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



  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();

    // this.unsubscribe.next();
    // this.unsubscribe.complete();
  }

  onSubmit() {

  }
}

