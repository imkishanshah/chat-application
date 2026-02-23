import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { E_STORAGE } from '../../../core/enums/storage.enum';
import { SharedService } from '../../../core/services/shared.service';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(public fb: FormBuilder, private _router: Router, private _apiService: ApiService, private _sharedService: SharedService) {;
  }

  ngOnInit() {
    this._createLoginForm();
  }

  public get f() {
    return this.loginForm.controls;
  } 

  // Login form
  private _createLoginForm() {
    this.loginForm = <FormGroup>this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  public onSubmit() {
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;

    this._apiService.post<any>('auth/login', credentials).subscribe({
      next: (response) => {    
        this._sharedService.setToken(response.token);    
        this._sharedService.setUser(JSON.stringify(response?.user))     
        this._router.navigate(['/chat']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
