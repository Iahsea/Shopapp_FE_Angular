import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoginDTO } from '../dtos/user/login.dto';

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FooterComponent, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  phoneNumber: string = '2233445566';
  password: string = '123456';

  constructor(private router: Router, private userService: UserService) {

  }

  login() {
    const message = `${this.phoneNumber} + ${this.password}`;
    alert(message);

    const loginDTO: LoginDTO = {
      "phone_number": this.phoneNumber,
      "password": this.password,
    }

    this.userService.login(loginDTO).subscribe(
      {
        next: (response: any) => {
          debugger
          this.router.navigate(['/'])
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          alert(`Cannot login, error: ${error.error}`)
          debugger
        }
      }
    )
  }
}
