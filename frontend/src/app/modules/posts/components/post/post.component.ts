import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { Store } from '@ngxs/store';
import { DeletePost } from '../../store-posts/posts.action';
import { PostModel } from '../../../../core/models';
import { RoleEnum } from '../../../../core/enums';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
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

  // Define permissions for each role
  // private readonly permissions: { [key: number]: (authorRole: number) => boolean } = {
  //   [RoleEnum.SuperAdmin]: () => true,
  //   [RoleEnum.ProjectAdmin]: (authorRole: number) => authorRole === RoleEnum.ProjectAdmin || [RoleEnum.Manager, RoleEnum.Client].includes(authorRole),
  //   [RoleEnum.Manager]: (authorRole: number) => authorRole === RoleEnum.Manager || authorRole === RoleEnum.Client,
  //   [RoleEnum.Client]: (authorRole: number) => authorRole === RoleEnum.Client
  // };


  // private currentUserRole: RoleEnum;
  // private currentUserId: number;
  // private readonly permissions: { [key: number]: (authorRole: number, authorId: number, currentUser: AuthorPostModel) => boolean } = {
  //   [RoleEnum.SuperAdmin]: () => true,
  //   [RoleEnum.ProjectAdmin]: (authorRole: number, authorId: number, currentUser: AuthorPostModel) =>
  //     (this.currentUserRole === RoleEnum.SuperAdmin || (this.currentUserRole === RoleEnum.ProjectAdmin && authorId === this.currentUserId) || (authorRole === RoleEnum.Manager || authorRole === RoleEnum.Client)),
  //
  //   [RoleEnum.Manager]: (authorRole: number, authorId: number, currentUser: AuthorPostModel) =>
  //     (this.currentUserRole === RoleEnum.SuperAdmin || (this.currentUserRole === RoleEnum.ProjectAdmin && authorId === this.currentUserId) || (authorRole === RoleEnum.Client)),
  //
  //   [RoleEnum.Client]: (authorRole: number, authorId: number, currentUser: AuthorPostModel) =>
  //     (this.currentUserRole === RoleEnum.SuperAdmin || (authorId === this.currentUserId))
  // };


  // Define permissions for each role
  // private readonly permissions: { [key: number]: (author: AuthorPostModel, currentUser: AuthorPostModel) => boolean } = {
  //   [RoleEnum.SuperAdmin]: () => true,
  //   [RoleEnum.ProjectAdmin]: (author: AuthorPostModel, currentUser: AuthorPostModel) =>
  //     (currentUser.role === RoleEnum.ProjectAdmin && author.id === currentUser.id) || [RoleEnum.Manager, RoleEnum.Client].includes(author.role),
  //
  //   [RoleEnum.Manager]: (author: AuthorPostModel, currentUser: AuthorPostModel) =>
  //     (currentUser.role === RoleEnum.Manager && author.id === currentUser.id) || author.role === RoleEnum.Client,
  //
  //   [RoleEnum.Client]: (author: AuthorPostModel, currentUser: AuthorPostModel) =>
  //     author.role === RoleEnum.Client && author.id === currentUser.id
  // };


  // Define permissions for each role
  private readonly permissions: { [key: number]: (author: AuthorPostModel, currentUser: AuthorPostModel) => boolean } = {
    [RoleEnum.SuperAdmin]: () => true,
    [RoleEnum.ProjectAdmin]: (author: AuthorPostModel, currentUser: AuthorPostModel) =>
      (currentUser.role === RoleEnum.ProjectAdmin && author.id === currentUser.id) || [RoleEnum.Manager, RoleEnum.Client].includes(author.role),

    [RoleEnum.Manager]: (author: AuthorPostModel, currentUser: AuthorPostModel) =>
      (currentUser.role === RoleEnum.Manager && author.id === currentUser.id) || author.role === RoleEnum.Client,

    [RoleEnum.Client]: (author: AuthorPostModel, currentUser: AuthorPostModel) =>
      author.role === RoleEnum.Client && author.id === currentUser.id
  };




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

    dialogRef.afterClosed().subscribe((result) => {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(new DeletePost(id, params));
      } else {
        return;
      }
    });
  }

  /**
   * Check if the user has permission to edit or delete a post
   * @param author
   */
  public checkPermissionRole(author: AuthorPostModel): boolean {

    const authorRole = author.role;
    const authorId = author.id

    const currentUserId  = this.authService.accountSubject$.value?.userInfo.id;
    const currentUserRole = this.authService.accountSubject$.value?.userInfo.role;
    const currentUser = this.authService.accountSubject$.value?.userInfo;

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



    // if (currentUserRole) {
    //   let checkPermission: any;
    //   // @ts-ignore
    //   checkPermission = this.permissions[author];
    //   // let checkPermission = this.permissions[currentUserRole](author, currentUser);
    //   // let checkPermission = this.permissions[currentUserRole](author, currentUser);
    //   // return checkPermission ? checkPermission(author, currentUser) : false;
    //   return checkPermission ? checkPermission(authorRole) : false;
    // }
    return false;
  }


  // public checkPermissionRole(authorRole: number): boolean {
  //   const currentUserRole = this.authService.accountSubject$.value?.userInfo.role;
  //   if (currentUserRole) {
  //     const checkPermission = this.permissions[currentUserRole];
  //     return checkPermission ? checkPermission(authorRole) : false;
  //   }
  //   return false;
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper function to cast to number
  protected readonly Number = Number;
}
