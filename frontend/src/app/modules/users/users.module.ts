import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { UsersState } from './store-users/users.state';
import { NgxsModule } from '@ngxs/store';

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
    NgxsModule.forFeature([UsersState])
  ]
})
export class UsersModule { }
