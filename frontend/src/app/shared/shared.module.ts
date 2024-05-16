import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
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

// Directives Modules
import { DirectivesModule } from './directives/directives.module';

// Custom Pipes
import { RolesPipe } from './pipes/roles.pipe';
import { AgePipe } from './pipes/age.pipe';
import { FormFilledPipe } from './pipes/form-filled.pipe';

// Custom Components
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const angularMaterialModules = [
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
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
];

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  DirectivesModule,
  ...angularMaterialModules,
];

@NgModule({
  declarations: [
    FormFilledPipe,
    RolesPipe,
    AgePipe,
    ChangePasswordComponent,
  ],
  imports: [...sharedModules],
  exports: [
    ...sharedModules,
    FormFilledPipe,
    RolesPipe,
    AgePipe,
    ChangePasswordComponent
  ],
})
export class SharedModule { }
