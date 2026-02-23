// auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedService } from '../services/shared.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const sharedService = inject(SharedService);

  if (isPlatformBrowser(platformId)) {
    const token = sharedService.getToken();
    if (token) return true;

    router.navigate(['/login']);
  }

  return false;
};
