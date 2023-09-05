import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesPipe } from './pipes/roles.pipe';

const modules = [
  CommonModule
]

@NgModule({
  declarations: [RolesPipe],
  imports: [...modules],
  exports: [
    ...modules,
    RolesPipe
  ],
})
export class SharedModule {
}
