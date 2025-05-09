import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/user/login.response'

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FooterComponent, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  phoneNumber: string = '2233445566';
  password: string = '123456';

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  login() {
    const message = `${this.phoneNumber} + ${this.password}`;
    alert(message);

    const loginDTO: LoginDTO = {
      "phone_number": this.phoneNumber,
      "password": this.password,
    }

    this.userService.login(loginDTO).subscribe(
      {
        next: (response: LoginResponse) => {
          debugger
          this.tokenService.setToken(response.token);
          // this.router.navigate(['/'])
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
