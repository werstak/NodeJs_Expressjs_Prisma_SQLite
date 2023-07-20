import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PostsRoutingModuleModule } from './home-routing.module.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModuleModule
  ]
})
export class HomeModule { }
