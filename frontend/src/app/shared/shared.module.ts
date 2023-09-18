import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesPipe } from './pipes/roles.pipe';
import { AgePipe } from './pipes/age.pipe';

const modules = [
  CommonModule
]

@NgModule({
  declarations: [
    RolesPipe,
    AgePipe
  ],
  imports: [...modules],
  exports: [
    ...modules,
    RolesPipe,
    AgePipe
  ],
})
export class SharedModule {
}
