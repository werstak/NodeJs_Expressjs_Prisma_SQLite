import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './layout/error-page/error-page.component';


const homeModule = () => import('./modules/home/home.module').then(m => m.HomeModule);
const authRoutingModuleModule = () => import('./modules/auth/auth-routing.module.module').then(m => m.AuthRoutingModuleModule);
const usersModule = () => import('./modules/users/users.module').then(m => m.UsersModule);
const postsModule = () => import('./modules/posts/posts.module').then(m => m.PostsModule);


const appRoutes: Routes = [
  {path: '', loadChildren: homeModule},
  {path: 'auth', loadChildren: authRoutingModuleModule},
  {path: 'users', loadChildren: usersModule},
  {path: 'posts', loadChildren: postsModule},
  {path: 'not-found', component: ErrorPageComponent},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
