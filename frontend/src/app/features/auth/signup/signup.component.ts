import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { E_STORAGE } from '../../../core/enums/storage.enum';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormErrorComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  userForm!: FormGroup;

  constructor(private _fb: FormBuilder, private _apiService: ApiService, private _sharedService: SharedService, private _router: Router) { }

  ngOnInit() {
    this._createUserForm();
  }

  public get f() {
    return this.userForm.controls;
  }

  // #region private methods
  private _createUserForm() {
    this.userForm = <FormGroup>this._fb.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', [Validators.required])
    }, {
      validators: this._passwordMatchValidator
    });
  }

  // Checks if password and confirm_password match
  private _passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');

    // If both exist and values don't match
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // Clear error if they match (but preserve other errors like required)
      if (confirmPassword?.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  };
  // #region end


  // #region public methods   

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public onSubmit(form: FormGroup) {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const credentials = form.value;

    delete credentials.confirm_password;

    this._apiService.post<any>('auth/signup', credentials).subscribe({
      next: (response) => {
        this._sharedService.setToken(response.token)
        this._sharedService.setUser(response?.user)
        this._router.navigate(['/chat']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
