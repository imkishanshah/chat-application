import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { E_STORAGE } from '../../../core/enums/storage.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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

  onSubmit() {
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;

    this.api.post<any>('auth/login', credentials).subscribe({
      next: (response) => {
        console.log(response);

        // Handle success - store token, redirect, etc.
        localStorage.setItem(E_STORAGE.TOKEN, response.token);
        this.router.navigate(['/chat']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
