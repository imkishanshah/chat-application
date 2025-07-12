// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ChatComponent } from './features/chat-room/components/chat/chat.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'chat',
        component: ChatComponent,
        canActivate: [authGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'login' }
];
