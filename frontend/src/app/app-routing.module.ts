import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { AuthModule } from './modules/auth/auth.module';


const homeModule = () => import('./modules/home/home.module').then(m => m.HomeModule);
const authModule = () => import('./modules/auth/auth.module').then(m => m.AuthModule);
const usersModule = () => import('./modules/users/users.module').then(m => m.UsersModule);
const postsModule = () => import('./modules/posts/posts.module').then(m => m.PostsModule);


const appRoutes: Routes = [
  {path: '', loadChildren: homeModule},
  {path: 'auth', loadChildren: authModule},
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
