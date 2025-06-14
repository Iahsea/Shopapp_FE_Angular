import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { minLength, ValidationError } from 'class-validator';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { error } from 'console';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user.profile.component.html',
  styleUrl: './user.profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  userResponse?: UserResponse;
  userProfileForm: FormGroup;
  token: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      address: ['', [Validators.minLength(3)]],
      password: ['', [Validators.minLength(3)]],
      retype_password: ['', [Validators.minLength(3)]],
      date_of_birth: [Date.now()],
    }, {
      validators: this.passwordMatchValidator()// Custom validator function for password match
    });
  }
  ngOnInit(): void {
    debugger
    this.token = this.tokenService.getToken() ?? '';
    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        debugger
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          address: this.userResponse?.address ?? '',
          date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10),
        });
        this.userService.saveUserResponseToLocalStorage(this.userResponse);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.log('error', error?.error?.message || error?.message || 'Unknown error');
      }
    })
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypedPassword = formGroup.get('retype_password')?.value;
      if (password !== retypedPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }



  save(): void {
    debugger
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };
      this.userService.updateUserDetail(this.token, updateUserDTO)
        .subscribe({
          next: (response: any) => {
            this.userService.removeUserFromLocalStorage();
            this.tokenService.removeToken();
            this.router.navigate(['/login']);
            console.log(">>>>>", response);

            this.toastService.showSuccess('User profile updated successfully');
          },
          error: (error: any) => {
            console.log('error', error);
            this.toastService.showError('Error updating user profile: ' + error);
          }
        })
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {
        this.toastService.showError('Password and Retype Password do not match');
      }
    }
  }

}
