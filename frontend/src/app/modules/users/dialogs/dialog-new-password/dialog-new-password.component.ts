import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-new-password',
  templateUrl: './dialog-new-password.component.html',
  styleUrls: ['./dialog-new-password.component.scss']
})
export class DialogNewPasswordComponent {
    constructor(
    public dialogRef: MatDialogRef<DialogNewPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  // userId: string;

  ngOnInit() {
    // this.userId = this.data.userId;
    // console.log('DialogNewPasswordComponent - ngOnInit - userId = ', this.data.userId)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
