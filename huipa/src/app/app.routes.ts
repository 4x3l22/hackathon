import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    { 
        path: 'login',
        component: Login
    },
];
