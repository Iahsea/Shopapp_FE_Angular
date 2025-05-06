import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DetailProductComponent } from '../detail-product/detail-product.component';
import { OrderComponent } from '../order/order.component';
import { OrderConfirmComponent } from '../order-confirm/order-confirm.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, DetailProductComponent, OrderComponent, OrderConfirmComponent, LoginComponent, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
