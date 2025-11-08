import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Resetpassword } from './pages/resetpassword/resetpassword';
import { Userprofile } from './pages/userprofile/userprofile';
import { Product } from './pages/product/product';
import { Carshop } from './pages/carshop/carshop';
import { CreateBusiness } from './pages/createbusiness/createbusiness';
import { ArtisanDashboard } from './pages/artisan-dashboard/artisan-dashboard';
import { LogisticsDashboard } from './pages/logistics-dashboard/logistics-dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'reset-password',
        component: Resetpassword
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'artisan-dashboard',
        component: ArtisanDashboard,
        canActivate: [authGuard]
    },
    {
        path: 'logistics-dashboard',
        component: LogisticsDashboard,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: Userprofile,
        canActivate: [authGuard]
    },
    {
        path: 'userprofile/:id',
        component: Userprofile,
        canActivate: [authGuard]
    },
    {
        path: 'product/:id',
        component: Product,
        canActivate: [authGuard]
    },
    {
        path: 'cart',
        component: Carshop,
        canActivate: [authGuard]
    },
    {
        path: 'carshop',
        component: Carshop,
        canActivate: [authGuard]
    },
    {
        path: 'create-business',
        component: CreateBusiness,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
