import { Routes } from '@angular/router';
import { OrderAdminComponent } from './order-admin.component';
import { DetailOrderAdminComponent } from './modules/detail-order/detail-order.admin.component';

export const orderRoutes: Routes = [
    { path: 'orders', component: OrderAdminComponent },
    { path: 'orders/:id', component: DetailOrderAdminComponent }
];
