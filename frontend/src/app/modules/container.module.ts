import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ContainerRoutingModule } from './container-routing.module';
import { MaterialSharedModule } from '../shared/material-shared.module';



@NgModule({
  declarations: [
    ContainerComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    MaterialSharedModule
  ]
})
export class ContainerModule { }
