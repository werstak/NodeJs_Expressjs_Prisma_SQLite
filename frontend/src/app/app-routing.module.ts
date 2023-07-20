import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { ContainerComponent } from './modules/container.component';


const appRoutes: Routes = [
  {
    path: '', component: ContainerComponent, children: [
      {
        path: '',
        loadChildren: () => import('./modules/container.module').then(m => m.ContainerModule)
      },
      {
        path: 'not-found', component: ErrorPageComponent
      },
      {
        path: '**', redirectTo: '/not-found', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
