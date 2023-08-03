import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

interface SnackBarMessageData {
  message: string;
  type: "success" | "error";
}


@Component({
  selector: 'app-snack-bar-message',
  templateUrl: './snack-bar-message.component.html',
  styleUrls: ['./snack-bar-message.component.scss']
})
export class SnackBarMessageComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarMessageComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarMessageData
  ) {}

  get snackStatus(): string {
    return this.data && this.data.type;
  }

  get snackMessage(): string {
    return this.data && this.data.message;
  }

  get isError(): boolean {
    return this.data && this.data.type === "error";
  }

  get isSuccess(): boolean {
    return this.data && this.data.type === "success";
  }
}
