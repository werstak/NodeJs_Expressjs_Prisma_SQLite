import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { debounceTime, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { CategoriesModel } from '../../../../shared/models/categories.model';
import { GetCategories } from '../../store-posts/posts.action';
import { FormControl } from '@angular/forms';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-dialog-categories-post',
  templateUrl: './dialog-categories-post.component.html',
  styleUrls: ['./dialog-categories-post.component.scss']
})
export class DialogCategoriesPostComponent implements OnInit, OnDestroy{
  constructor(
    public store: Store,
    public dialogRef: MatDialogRef<DialogCategoriesPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  listAllCategories: any = [];

  category = new FormControl('');

  ngOnInit() {
    this.fetchCategories();
    this.change();
  }


  private change() {
    this.category.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy)
    ).subscribe(val => console.log('form value', val));
  }


  private fetchCategories() {
    this.store.dispatch(new GetCategories());
    this.listAllCategories$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.listAllCategories = resp;


        if (this.listAllCategories.length) {
          // this.filteredUsers();
        }

      });
  }


  onNoClick(): void {
    this.dialogRef.close();
    this.category.valueChanges;
  }


  editCategory(category: any) {
    console.log('category = ', category)
    this.category.patchValue(category.name);

  }

  deleteCategory(category: any) {
    console.log('category = ', category)

  }

  addCategory() {

  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.dialogRef.close();
  }

}
