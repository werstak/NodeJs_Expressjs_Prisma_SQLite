import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllowAccessDirective } from './allow-access.directive';
import { DenyAccessDirective } from './deny-access.directive';

// Directives
const sharedDirectives = [
  AllowAccessDirective,
  DenyAccessDirective
];

@NgModule({
  declarations: [
    ...sharedDirectives
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...sharedDirectives
  ]
})
export class DirectivesModule {
}
