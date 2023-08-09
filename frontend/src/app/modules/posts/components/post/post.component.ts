import { Component, Input, OnInit } from '@angular/core';
import { PostModel } from '../../../../shared/models/post.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { UserModel } from '../../../../shared/models/user.model';
import { DialogUsersComponent } from '../../../users/dialogs/dialog-users/dialog-users.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

// export interface DialogData {
//   animal: string;
//   name: string;
// }

export class PostComponent implements OnInit {

  @Input() post: PostModel;
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;


  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchData();
    // this.fetchData();

  }

  openDialogEditPost(id: number): void {
    console.log('edit', id)

    const dialogRef = this.dialog.open(DialogPostsComponent, {
      data: { id, newPost: false, name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('111 The dialog was closed', result);
      this.animal = result;
    });
  }



  // editUser(id: UserModel) {
  //   console.log('edit', id)
  //   const dialogRef = this.dialog.open(DialogUsersComponent, {
  //     data: {id, newUser: false}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('EDIT dialogRef result', result)
  //
  //     setTimeout(() => {
  //       this.table.renderRows();
  //     }, 1000)
  //
  //     // if (result === 1) {
  //     //   // this.refreshTable();
  //     //   this.table.renderRows();
  //     // }
  //   });
  // }


  openDialogDeletePost(id: number) {
    console.log('openDialogDeletePost()', id)

  }

  private fetchData() {

  }
}
