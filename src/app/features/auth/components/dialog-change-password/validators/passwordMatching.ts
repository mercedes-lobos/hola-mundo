import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatching: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const passwordValue = control.get('password')?.value;
  const confirmPasswordValue = control.get('password2')?.value;

  return passwordValue !== confirmPasswordValue ? { passwordMatchingError: true } : null;
};
