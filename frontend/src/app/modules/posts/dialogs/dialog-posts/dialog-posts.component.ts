import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostModel } from '../../../../shared/models/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostsService } from '../../posts.service';
import { Store } from '@ngxs/store';
import { AddPost, SetSelectedPost, UpdatePost } from '../../store-posts/posts.action';

const pictureDefault = 'assets/images/image-placeholder.jpg';

@Component({
  selector: 'app-dialogs-posts',
  templateUrl: './dialog-posts.component.html',
  styleUrls: ['./dialog-posts.component.scss']
})


export class DialogPostsComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public dialogRef: MatDialogRef<DialogPostsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public postsService: PostsService,
  ) {
  }

  public postForm: FormGroup;
  private subPost: Subscription;

  currentPost: PostModel;
  respNewPost: PostModel;
  respUpdatePost: PostModel;

  pictureUrl: any;
  previousPictureUrl: '';
  pictureFile: any;
  pictureDefault: any;


  ngOnInit() {
    this.buildForm();
    console.log('Open DIALOG data = ', this.data)
    this.pictureDefault = pictureDefault;

    if (this.data.newPost) {
      this.postForm.reset();
      this.postForm.patchValue({
        published: true
      });
    } else {
      this.initPostFormValue();
    }
  }

  private buildForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      content: ['', []],
      published: ['', []]
    });
  }

  private initPostFormValue() {
    const id: number = this.data.id;
    this.subPost = this.postsService.getPost(id).subscribe(data => {
      this.currentPost = data
      this.previousPictureUrl = data.picture;
      this.pictureUrl = data.picture;
      this.postForm.setValue({
        title: data.title,
        description: data.description,
        content: data.content,
        published: data.published
      });
      this.store.dispatch(new SetSelectedPost(data));
    });
  }


  /**
   Picture upload
   */
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
      console.log('handleImageLoaded() files[0]', files)
      this.handleImagePreview(files);
    }
  }

  handleImagePreview(files: any): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.pictureUrl = event.target.result;
    }
    this.pictureFile = files[0];
    reader.readAsDataURL(files[0]);
  }

  /**
   Delete picture
   */
  public deletePicture() {
    this.pictureUrl = '';
    this.pictureFile = '';
  }

  /**
   Sending the Form
   */
  onSubmitPost(): void {
    if (this.data.newPost) {
      this.addPost();
    } else {
      this.updatePost();
    }
  }


  /**
   Adding a new post
   */
  private addPost(): void {
    if (this.postForm.invalid) {
      return;
    }
    const picture = this.pictureFile;
    const params: any = {
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      content: this.postForm.value.content,
      published: this.postForm.value.published,
      userId: 1
    };
    this.store.dispatch(new AddPost(params, picture));
  }


  /**
   Update current post
   */
  private updatePost(): void {
    if (this.postForm.invalid) {
      return;
    }
    let {id, userId} = this.currentPost;
    const picture = this.pictureFile;
    const previousPictureUrl = this.previousPictureUrl;
    let pictureOrUrl: boolean;
    pictureOrUrl = !!this.pictureUrl;

    const params: any = {
      id: id,
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      content: this.postForm.value.content,
      published: this.postForm.value.published,
      userId: userId
    };
    this.store.dispatch(new UpdatePost(id, params, picture, pictureOrUrl, previousPictureUrl));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subPost?.unsubscribe();
    this.dialogRef.close();
  }
}

