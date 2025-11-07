import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { Login } from './pages/login/login';
import { Resetpassword } from './pages/resetpassword/resetpassword';

export const routes: Routes = [
    {
        path: 'register',
        component: RegisterComponent,
    },
    { 
        path: 'login', 
        component: Login
    },
    {
        path: 'reset-password',
        component: Resetpassword
    }
];
