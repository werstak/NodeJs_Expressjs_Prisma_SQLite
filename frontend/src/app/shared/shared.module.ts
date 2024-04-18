import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesPipe } from './pipes/roles.pipe';
import { AgePipe } from './pipes/age.pipe';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

const modules = [
  CommonModule,
  MatCardModule,
  FormsModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatDividerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatSnackBarModule,
  RouterModule,
]

@NgModule({
  declarations: [
    RolesPipe,
    AgePipe,
    ChangePasswordComponent
  ],
  imports: [...modules],
  exports: [
    ...modules,
    RolesPipe,
    AgePipe,
    ChangePasswordComponent
  ],
})
export class SharedModule {
}
