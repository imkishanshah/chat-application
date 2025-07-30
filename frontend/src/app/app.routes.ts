// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ChatComponent } from './features/chat-room/components/chat/chat.component';
import { authGuard } from './core/guards/auth.guard';
import { SignupComponent } from './features/auth/signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'chat',
        component: ChatComponent,
        canActivate: [authGuard]
    },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'login' }
];
