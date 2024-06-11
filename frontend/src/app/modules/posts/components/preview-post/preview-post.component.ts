import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { DeletePost } from '../../store-posts/posts.actions';
import { PostModel } from '../../../../core/models';
import { RoleEnum } from '../../../../core/enums';
import { AuthorPostModel } from '../../../../core/models/author-post.model';
import { PermissionService } from '../../../../shared/services';

@Component({
  selector: 'app-preview-post',
  templateUrl: './preview-post.component.html',
  styleUrls: ['./preview-post.component.scss']
})
export class PreviewPostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel | null = null;

  private destroy$: Subject<void> = new Subject<void>();
  protected readonly RoleEnum = RoleEnum;

  constructor(
    public store: Store,
    public dialog: MatDialog,
    public permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    if (!this.post) {
      console.warn('Post is not defined in PreviewPostComponent');
    }
  }

  openDialogEditPost(id: number): void {
    const dialogRef = this.dialog.open(DialogPostsComponent, {
      data: { id, newPost: false },
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  openDialogDeletePost(post: PostModel): void {
    if (!post) return;

    const { id, title, picture } = post;
    const params = { picture };

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: title,
        title: 'Delete preview-post - ',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result === true) {
        this.store.dispatch(new DeletePost(id, params));
      }
    });
  }

  public hasActionPermission(author: AuthorPostModel): boolean {
    return this.permissionService.checkActionPostPermission(author);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
