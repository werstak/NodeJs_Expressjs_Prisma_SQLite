import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to check if the date is in the future.
 */
export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const date = new Date(control.value);
  const today = new Date();
  return date > today ? { futureDate: true } : null;
};
