import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/user/login.response'
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { UserResponse } from '../../responses/user/user.response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // /*
  // // Login user 
  // phoneNumber: string = '6666666';
  // password: string = '123';
  // */

  // Login admin
  phoneNumber: string = '0909090909';
  password: string = '123456';

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse


  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        console.log('Error getting roles:', error)
        debugger
      }
    })

  }

  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    }

    this.userService.login(loginDTO).subscribe(
      {
        next: (response: LoginResponse) => {
          debugger
          const { token } = response;
          if (this.rememberMe) {
            this.tokenService.setToken(token);
            this.userService.getUserDetail(token).subscribe({
              next: (response: any) => {
                debugger
                this.userResponse = {
                  ...response,
                  date_of_birth: new Date(response.date_of_birth),
                };
                this.userService.saveUserResponseToLocalStorage(this.userResponse);
                if (this.userResponse?.role.name == 'admin') {
                  this.router.navigate(['/admin']);
                } else if (this.userResponse?.role.name == 'user') {
                  this.router.navigate(['/']);
                }

                this.toastService.showSuccess('Login successfully');

              },
              complete: () => {
                debugger
              },
              error: (error: any) => {
                debugger
                this.toastService.showError('Erorr ' + error?.error?.message);
              }
            })
          }
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          this.toastService.showError('Erorr ' + error?.error?.message);
        }
      }
    )
  }
}
