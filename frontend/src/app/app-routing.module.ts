import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// import { PagesComponent } from './pages/pages.component';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
// import { AuthRoutingModuleModule } from './modules/auth/auth-routing.module.module';
// import { HomeComponent } from './modules/home/home.component';
// import { HomeModule } from './modules/home/home.module';
// import { PostsModule } from './modules/posts/posts.module';
// import { UsersModule } from './modules/users/users.module';


const appRoutes: Routes = [
  // {
  //   path: '', component: HomeComponent, children: [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth-routing.module.module').then(m => m.AuthRoutingModuleModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./modules/posts/posts.module').then(m => m.PostsModule)
  },
  {
    path: 'not-found', component: ErrorPageComponent
  },
  {
    path: '**', redirectTo: '/not-found', pathMatch: 'full'
  }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
