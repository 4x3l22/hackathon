import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { Login } from './pages/login/login';
import { Resetpassword } from './pages/resetpassword/resetpassword';
import { Userprofile } from './pages/userprofile/userprofile';
import { Product } from './pages/product/product';
import { Carshop } from './pages/carshop/carshop';

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
    },
    {
        path: 'profile',
        component: Userprofile
    },
    {
        path: 'product/:id',
        component: Product
    },
    {
        path: 'cart',
        component: Carshop
    }
];
