import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogNewPasswordModel } from '../../../../core/models/dialog-new-password.model';

@Component({
  selector: 'app-dialog-new-password',
  templateUrl: './dialog-new-password.component.html',
  styleUrls: ['./dialog-new-password.component.scss']
})
export class DialogNewPasswordComponent implements OnInit, OnDestroy {
    constructor(
    public dialogRefNewPasswordComponent: MatDialogRef<DialogNewPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogNewPasswordModel
  ) {
  }

  ngOnInit() {
    console.log('ngOnInit DialogNewPasswordComponent - data = ', this.data)
  }

  closeClick() {
    this.dialogRefNewPasswordComponent.close();
  }

  ngOnDestroy(): void {
    this.dialogRefNewPasswordComponent.close();
  }

}
