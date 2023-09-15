import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { debounceTime, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { CategoriesModel } from '../../../../shared/models/categories.model';
import {
  AddCategory,
  DeleteCategory,
  GetCategories,
  UpdateCategory
} from '../../store-posts/posts.action';
import { FormControl } from '@angular/forms';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-dialog-categories-post',
  templateUrl: './dialog-categories-post.component.html',
  styleUrls: ['./dialog-categories-post.component.scss']
})
export class DialogCategoriesPostComponent implements OnInit, OnDestroy {
  constructor(
    public store: Store,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogCategoriesPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  listAllCategories: CategoriesModel[] = [];
  category = new FormControl('');
  selectedCategory: CategoriesModel;
  categoryName: string | null;

  addFlag: boolean = false;
  visibilityFields: boolean = false;

  ngOnInit() {
    this.fetchCategories();
    this.onChangesCategory();
  }


  private onChangesCategory() {
    this.category.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy)
    ).subscribe(val => {
        console.log('form value', val)
        this.categoryName = val;
      }
    );
  }


  private fetchCategories() {
    this.store.dispatch(new GetCategories());
    this.listAllCategories$.pipe(
      takeUntil(this.destroy))
      .subscribe(resp => {
        this.listAllCategories = resp;
      });
  }


  editCategory(category: any) {
    console.log('category = ', category)
    this.selectedCategory = category;
    this.visibilityFields = true;
    this.addFlag = false;
    this.category.patchValue(category.name);
  }

  addCategory() {
    if (this.categoryName !== '') {
      const params = {
        name: this.categoryName
      };
      this.store.dispatch(new AddCategory(params));
    } else {
      return;
    }

    // this.addFlag = false;
    // this.visibilityFields = false;
    this.category.patchValue('');
  }

  updateCategory() {
    const {id} = this.selectedCategory;
    const params = {
      name: this.categoryName
    }
    this.store.dispatch(new UpdateCategory(id, params));
    return this.category.patchValue('');
  }

  displayFields() {
    this.visibilityFields = true;
    this.addFlag = true;
    this.category.patchValue('');
  }

  openDialogDeleteCategory(category: any) {
    console.log('DIALOG dell category', category)

    let {id, name} = category;
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: name,
        title: 'Delete category - ',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('deleteCategory - afterClosed', result)
      if (result === true) {
        this.store.dispatch(new DeleteCategory(id));
      } else {
        return;
      }
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
    this.category.valueChanges;
  }


  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.dialogRef.close();
  }

}
