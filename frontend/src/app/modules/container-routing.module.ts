import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
// import { ListDocumentsComponent } from './list-documents/list-documents.component';
// import { DocumentsComponent } from './documents/documents.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent
  },
  // {
  //   path: 'documents',
  //   component: DocumentsComponent
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
export class ContainerRoutingModule { }
