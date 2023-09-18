import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { UsersState } from './store-users/users.state';
import { NgxsModule } from '@ngxs/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogUsersComponent } from './dialogs/dialog-users/dialog-users.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersFilterPanelComponent } from './components/users-filter-panel/users-filter-panel.component';
import { SharedModule } from '../../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  // {
  //   path: 'auth',
  //   component: AuthComponent
  // },
  // {
  //   path: 'documents/:pageId',
  //   component: DocumentsComponent
  // }
];

@NgModule({
  declarations: [
    UsersComponent,
    UsersTableComponent,
    DialogUsersComponent,
    UsersFilterPanelComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([UsersState])
  ]
})
export class UsersModule { }
