import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { E_STORAGE } from '../../../core/enums/storage.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(public fb: FormBuilder, private router: Router, private api: ApiService,) {
  }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = <FormGroup>this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  toSignUp() {
    this.router.navigate(['/signup']);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;

    this.api.post<any>('auth/login', credentials).subscribe({
      next: (response) => {
        localStorage.setItem(E_STORAGE.TOKEN, response.token);
        localStorage.setItem(E_STORAGE.USER, JSON.stringify(response?.user));
        this.router.navigate(['/chat']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
