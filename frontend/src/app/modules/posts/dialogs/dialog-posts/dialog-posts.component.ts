import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostModel } from '../../../../shared/models/post.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
import { AddPost, GetCategories, GetListAllUsers, SetSelectedPost, UpdatePost } from '../../store-posts/posts.action';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { CategoriesModel } from '../../../../shared/models/categories.model';


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

  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;
  listAllCategories: any = [];

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  newCategoryControl = new FormControl();
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  public postForm: FormGroup;

  currentPost: PostModel;
  respNewPost: PostModel;
  respUpdatePost: PostModel;

  pictureUrl: any;
  previousPictureUrl: '';
  pictureFile: any;
  pictureDefault: any;


  ngOnInit() {
    this.fetchCategories();
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

  private fetchCategories() {
    this.store.dispatch(new GetCategories());
    this.listAllCategories$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.listAllCategories = resp;

        console.log(1111 ,'this.listAllCategories' , this.listAllCategories)

        if (this.listAllCategories.length) {
          // this.filteredUsers();
        }
      });
  }



  private buildForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      content: ['', []],
      categories: ['', []],
      published: ['', []]
    });
  }

  private initPostFormValue() {
    const id: number = this.data.id;
    this.postsService.getPost(id).pipe(
      takeUntil(this.destroy))
      .subscribe(data => {
      this.currentPost = data
      this.previousPictureUrl = data.picture;
      this.pictureUrl = data.picture;
      this.postForm.patchValue({
        title: data.title,
        description: data.description,
        content: data.content,
        categories: data.categories,
        published: data.published
      });
      this.store.dispatch(new SetSelectedPost(data));
    });
  }




  onToppingRemoved(topping: string) {
    console.log(0, topping)

    const toppings = this.postForm.controls['categories'].value;
    // const toppings = this.categories.value as string[];
    console.log(1, toppings)

    this.removeFirst(toppings, topping);

    console.log(2, 'removeFirst', toppings)

    this.postForm.controls['categories'].patchValue(toppings)
  }

  // private removeFirst(array: any, toRemove: any): void {
  //   const index = array.indexOf(toRemove);
  //   if (index !== -1) {
  //     array.splice(index, 1);
  //   }
  // }


  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
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
      categories: this.postForm.value.categories,
      published: this.postForm.value.published,
      userId: 1
    };
    this.store.dispatch(new AddPost(params, picture));
  }


  /**
   Update current post
   */
  private updatePost(): void {
    console.log('this.postForm.value', this.postForm.value)

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
      categories: this.postForm.value.categories,
      userId: userId
    };
    this.store.dispatch(new UpdatePost(id, params, picture, pictureOrUrl, previousPictureUrl));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.dialogRef.close();
  }
}

