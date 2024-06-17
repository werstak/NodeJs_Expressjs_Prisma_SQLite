import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
import { AddPost, GetCategories, SetSelectedPost, UpdatePost } from '../../store-posts/posts.actions';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { AuthService } from '../../../auth/auth.service';
import { CategoriesModel, PostModel } from '../../../../core/models';
import { NotificationService } from '../../../../shared/services';
import * as _ from 'lodash';

const pictureDefault = 'assets/images/image-placeholder.jpg';

@Component({
  selector: 'app-dialog-posts',
  templateUrl: './dialog-posts.component.html',
  styleUrls: ['./dialog-posts.component.scss']
})
export class DialogPostsComponent implements OnInit, OnDestroy {

  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;

  userId: number | undefined;
  listAllCategories: CategoriesModel[] = [];
  dataLoading: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  postForm: FormGroup;
  currentPost: PostModel | undefined;
  pictureUrl: string | ArrayBuffer | null = null;
  previousPictureUrl: string | undefined;
  pictureFile: File | undefined;
  pictureDefault: string = pictureDefault;
  isSameCategory = (option1: any, option2: any) => option1.id === option2.id;
  initCategories: CategoriesModel[] = [];
  selectedCategories: CategoriesModel[] = [];
  includedCategories: CategoriesModel[] = [];
  excludedCategories: CategoriesModel[] = [];

  constructor(
    public store: Store,
    public dialogRef: MatDialogRef<DialogPostsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.accountValue?.userInfo.id;
    this.fetchCategories();
    this.buildForm();
    if (this.data.newPost) {
      this.postForm.reset();
      this.postForm.patchValue({ published: true });
    } else {
      this.fetchCurrentPost();
    }
    this.calculationSelectedCategories();
  }

  private fetchCategories(): void {
    this.dataLoading = true;
    this.store.dispatch(new GetCategories());
    this.listAllCategories$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(categories => {
      this.listAllCategories = categories;
      this.dataLoading = false;
    });
  }

  private fetchCurrentPost(): void {
    const id: number = this.data.id;
    this.postsService.getPost(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data: PostModel) => {
        this.currentPost = data;
        this.initCategories = data.categories;
        this.initPostFormValue();
        this.previousPictureUrl = data.picture;
        // this.pictureUrl = data.picture;
        this.store.dispatch(new SetSelectedPost(data));
      },
      (error) => {
        this.dataLoading = false;
        console.error(error);
        this.notificationService.showError(error);
      }
    );
  }

  private buildForm(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      content: ['', []],
      categories: [[], [Validators.required]],
      published: [false, []]
    });
  }

  private initPostFormValue(): void {
    if (this.currentPost) {
      this.postForm.patchValue({
        title: this.currentPost.title,
        description: this.currentPost.description,
        content: this.currentPost.content,
        categories: this.currentPost.categories.map(cat => cat.id),
        published: this.currentPost.published
      });
    }
  }

  private calculationSelectedCategories(): void {
    this.postForm.get('categories')?.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy$)
    ).subscribe(
      (selectedIds: number[]) => {
        this.selectedCategories = this.listAllCategories.filter(cat => selectedIds.includes(cat.id));
        this.includedCategories = this.selectedCategories.filter(cat => !this.initCategories.find(initCat => initCat.id === cat.id));
        this.excludedCategories = this.initCategories.filter(initCat => !this.selectedCategories.find(cat => cat.id === initCat.id));
      }
    );
  }

  onToppingRemoved(topping: CategoriesModel): void {
    const categoriesArray = this.postForm.get('categories')?.value as number[];
    const updatedCategories = categoriesArray.filter(catId => catId !== topping.id);
    this.postForm.get('categories')?.patchValue(updatedCategories);
  }

  trackByFn(index: number, item: CategoriesModel): number {
    return item.id;
  }

  handleImageLoaded(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.pictureUrl = reader.result;
          this.pictureFile = file;
        };
      } else {
        this.notificationService.showError('Please select an image file.');
      }
    }
  }

  deletePicture(): void {
    this.pictureUrl = null;
    this.pictureFile = undefined;
  }

  onSubmitPost(): void {
    if (this.postForm.invalid) {
      return;
    }
    if (this.data.newPost) {
      this.addPost();
    } else if (this.currentPost) {
      this.updatePost(this.currentPost.id);
    }
  }

  private addPost(): void {
    const formData = this.prepareFormData();
    this.store.dispatch(new AddPost(formData, this.pictureFile));
  }

  private updatePost(postId: number): void {
    const formData = this.prepareFormData();
    const pictureOrUrl = !!this.pictureUrl;
    this.store.dispatch(new UpdatePost(postId, formData, this.pictureFile, pictureOrUrl, this.previousPictureUrl));
  }

  private prepareFormData(): any {
    const formData = {
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      content: this.postForm.value.content,
      categories: this.postForm.value.categories,
      published: this.postForm.value.published,
      userId: this.userId
    };
    return formData;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
