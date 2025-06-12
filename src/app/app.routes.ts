import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { AuthGuardFn } from './guards/auth.guard';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuardFn } from './guards/admin.guard';
import { OrderAdminComponent } from './components/admin/order/order-admin.component';
import { ProductAdminComponent } from './components/admin/product/product-admin.component';
import { CategoryAdminComponent } from './components/admin/category/category-admin.component';
import { DetailOrderAdminComponent } from './components/admin/order/modules/detail-order/detail-order.admin.component';
import { DetailProductAdminComponent } from './components/admin/product/modules/detail-product/detail-product.admin.component';
import { DashboardAdminComponent } from './components/admin/dashboard/dashboard.admin.component';
import { productRoutes } from './components/admin/product/product-admin.routes';
import { orderRoutes } from './components/admin/order/order-admin.routes';
import { categoryRoutes } from './components/admin/category/category-admin.routes';
import { LoginGuardFn } from './guards/login.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuardFn] },
    { path: 'register', component: RegisterComponent, canActivate: [LoginGuardFn] },
    { path: 'products/:id', component: DetailProductComponent },
    { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
    { path: 'orders/:id', component: OrderDetailComponent },

    //Admin
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuardFn],
        children: [
            ...productRoutes,
            ...orderRoutes,
            ...categoryRoutes,
            { path: 'dashboard', component: DashboardAdminComponent }
        ]
    },
];
