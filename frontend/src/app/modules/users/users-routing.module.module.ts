import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModuleModule { }
