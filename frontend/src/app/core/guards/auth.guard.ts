// auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { E_STORAGE } from '../enums/storage.enum';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem(E_STORAGE.TOKEN);
    if (token) return true;

    router.navigate(['/login']);
  }

  return false;
};
