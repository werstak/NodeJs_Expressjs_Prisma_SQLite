import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roles'
})
export class RolesPipe implements PipeTransform {
  transform(value: number): any {
    if (value == 1) {
      return 'Super Admin';
    } else if (value == 2) {
      return 'Project Admin';
    } else if (value == 3) {
      return 'Manager';
    } else if (value == 4) {
      return 'Client';
    } else {
      return;
    }
  }
}
