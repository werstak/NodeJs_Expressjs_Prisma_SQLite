import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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


export class DialogPostsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPostsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

