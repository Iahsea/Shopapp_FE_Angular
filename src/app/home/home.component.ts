import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { DetailProductComponent } from '../components/detail-product/detail-product.component';
import { OrderComponent } from '../components/order/order.component';
import { OrderConfirmComponent } from '../components/order-confirm/order-confirm.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, DetailProductComponent, OrderComponent, OrderConfirmComponent, LoginComponent, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
