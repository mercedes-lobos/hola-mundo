import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordNotDifferent: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const oldPasswordValue = control.get('old_password')?.value;
  const newPasswordValue = control.get('password')?.value;

  return oldPasswordValue !== '' && oldPasswordValue === newPasswordValue ? { passwordNotDifferentError: true } : null;
};
