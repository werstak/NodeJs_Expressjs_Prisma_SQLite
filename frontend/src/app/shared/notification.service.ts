import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarMessageComponent } from './components/snack-bar-message/snack-bar-message.component';

@Injectable()
export class NotificationService {
  private errorMessageConfig: MatSnackBarConfig = {
    panelClass: "notification-error-message-wrapper",
    duration: 5000,
    verticalPosition: "top",
    horizontalPosition: "center",
  };

  private plainMessageConfig: MatSnackBarConfig = {
    panelClass: "notification-success-message-wrapper",
    duration: 5000,
    verticalPosition: "top",
    horizontalPosition: "center",
  };

  constructor(private _snackBar: MatSnackBar) {}

  showError(message: string, title?: string): void {
    const snackBarRef = this._snackBar.openFromComponent(
      SnackBarMessageComponent,
      {
        ...this.errorMessageConfig,
        data: {
          message,
          type: "error",
        },
      }
    );
  }

  showSuccess(message: any, title?: string): void {
    const snackBarRef = this._snackBar.openFromComponent(
      SnackBarMessageComponent,
      {
        ...this.plainMessageConfig,
        data: {
          message,
          type: "success",
        },
      }
    );
  }
}
