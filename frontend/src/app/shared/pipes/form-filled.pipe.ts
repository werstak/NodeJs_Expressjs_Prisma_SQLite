import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'formFilled'
})
export class FormFilledPipe implements PipeTransform {
  // transform(form: FormGroup): boolean {
  //   return Object.values(form.controls).some(control => !!control.value);
  // }
  transform(form: FormGroup): boolean {
    const formValues = form.value;
    return formValues.firstName || formValues.lastName || formValues.email;
  }
}
