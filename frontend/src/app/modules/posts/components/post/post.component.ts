import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { AuthService } from '../../../auth/auth.service';
import { DeletePost } from '../../store-posts/posts.action';
import { PostModel } from '../../../../core/models';
import { RoleEnum } from '../../../../core/enums';
import { AuthorPostModel } from '../../../../core/models/author-post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Enum to access route names
  protected readonly RoleEnum = RoleEnum;

  constructor(
    public store: Store,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
  }

  /**
   * Opens the dialog for editing a post
   * @param id ID of the post to edit
   */
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

  /**
   * Opens the dialog for deleting a post
   * @param post Post to delete
   */
  openDialogDeletePost(post: PostModel): void {
    const { id, title, picture } = post;
    const params = { picture };

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: title,
        title: 'Delete post - ',
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

  /**
   * Check if the current user has permission to edit or delete a post
   * @param author Author of the post
   */
  public checkPermissionRolePosts(author: AuthorPostModel): boolean {
    const authorRole = author.role;
    const authorId = author.id
    const currentUserId  = this.authService.accountSubject$.value?.userInfo.id;
    const currentUserRole = this.authService.accountSubject$.value?.userInfo.role;
    if (currentUserRole) {
      if (currentUserRole === RoleEnum.SuperAdmin) {
        return true;
      } else if (currentUserRole === RoleEnum.ProjectAdmin) {
        return (currentUserRole === RoleEnum.ProjectAdmin && authorId === currentUserId) || [RoleEnum.Manager, RoleEnum.Client].includes(authorRole);

      } else if (currentUserRole === RoleEnum.Manager) {
        return (currentUserRole === RoleEnum.Manager && authorId === currentUserId) || authorRole === RoleEnum.Client;

      } else if (currentUserRole === RoleEnum.Client) {
        return authorRole === RoleEnum.Client && authorId === currentUserId;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
