import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatTableModule } from '@angular/material/table';
// import { MatCardModule } from '@angular/material/card';

const modules = [
  CommonModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatSnackBarModule,
  MatDialogModule
  // MatTableModule,
  // MatCardModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  declarations: [],
})

export class MaterialSharedModule {
}
