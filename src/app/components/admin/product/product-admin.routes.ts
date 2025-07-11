import { Routes } from '@angular/router';
import { ProductAdminComponent } from './product-admin.component';
import { DetailProductAdminComponent } from './modules/detail-product/detail-product.admin.component';
import { CreateProductAdminComponent } from './modules/create-product/create-product.admin.component';

export const productRoutes: Routes = [
    { path: 'products', component: ProductAdminComponent },
    { path: 'products/:id', component: DetailProductAdminComponent },
    { path: 'create-products', component: CreateProductAdminComponent }
];
