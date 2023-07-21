import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MaterialSharedModule } from '../../shared/material-shared.module';
import { MatCardModule } from '@angular/material/card';

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
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    RouterModule.forChild(routes),
  ]
})
export class UsersModule { }
