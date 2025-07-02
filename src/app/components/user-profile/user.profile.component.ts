import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { error } from 'console';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../environments/environment';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './user.profile.component.html',
    styleUrl: './user.profile.component.scss',
})
export class UserProfileComponent implements OnInit {
    userResponse?: UserResponse;
    userProfileForm: FormGroup;
    token: string = '';
    avatarPreview: string | ArrayBuffer | null = null;
    selectedAvatarFile: File | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private tokenService: TokenService,
        private router: Router,
        private toastService: ToastService
    ) {
        debugger;
        this.userProfileForm = this.formBuilder.group(
            {
                fullname: [''],
                address: ['', [Validators.minLength(3)]],
                password: [''],
                retype_password: [''],
                date_of_birth: [Date.now()],
                // user_avatar: ['']
            },
            {
                validators: this.passwordMatchValidator(), // Custom validator function for password match
            }
        );

        // this.checkPasswordChange();
        // Thêm validator có điều kiện cho password và retype_password
    }
    ngOnInit(): void {
        console.log('Form Valid:', this.userProfileForm.valid);
        console.log('Password Errors:', this.userProfileForm.get('password')?.errors);
        console.log('Retype Password Errors:', this.userProfileForm.get('retype_password')?.errors);
        debugger;
        this.token = this.tokenService.getToken() ?? '';
        this.userService.getUserDetail(this.token).subscribe({
            next: (response: any) => {
                debugger;
                this.userResponse = {
                    ...response,
                    date_of_birth: new Date(response.date_of_birth),
                    user_avatar: `${environment.apiBaseUrl}/avatars/${response.user_avatar}`,
                };
                this.userProfileForm.patchValue({
                    fullname: this.userResponse?.fullname ?? '',
                    address: this.userResponse?.address ?? '',
                    date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10),
                });
                this.checkPasswordChange();
                this.userService.saveUserResponseToLocalStorage(this.userResponse);
            },
            complete: () => {
                debugger;
                // console.log('Form Valid:', this.userProfileForm.valid);
                // console.log('Password Errors:', this.userProfileForm.get('password')?.errors);
                // console.log('Retype Password Errors:', this.userProfileForm.get('retype_password')?.errors);
            },
            error: (error: any) => {
                debugger;
                console.log('error', error?.error?.message || error?.message || 'Unknown error');
            },
        });
    }

    checkPasswordChange() {
        this.userProfileForm.get('password')?.valueChanges.subscribe((password) => {
            debugger;
            const retypeControl = this.userProfileForm.get('retype_password');
            const passwordControl = this.userProfileForm.get('password');

            if (password && password.trim().length > 0) {
                passwordControl?.setValidators([Validators.minLength(3)]);
                retypeControl?.setValidators([Validators.minLength(3)]);
            } else {
                passwordControl?.clearValidators();
                retypeControl?.clearValidators();
                passwordControl?.setErrors(null);
                retypeControl?.setErrors(null);
            }

            passwordControl?.updateValueAndValidity({ onlySelf: true });
            retypeControl?.updateValueAndValidity({ onlySelf: true });
        });
    }

    passwordMatchValidator(): ValidatorFn {
        debugger;
        return (formGroup: AbstractControl): ValidationErrors | null => {
            debugger;
            const password = formGroup.get('password')?.value;
            const retypedPassword = formGroup.get('retype_password')?.value;

            if (password === '' && retypedPassword === '') {
                return null;
            }
            if (password !== retypedPassword) {
                return { passwordMismatch: true };
            }

            return null;
        };
    }

    onAvatarSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedAvatarFile = input.files[0];
            this.userProfileForm.get('avatarFileName')?.setValue(this.selectedAvatarFile.name);
            const reader = new FileReader();
            reader.onload = () => {
                this.avatarPreview = reader.result;
            };
            reader.readAsDataURL(this.selectedAvatarFile);
        }
    }

    save(): void {
        debugger;
        console.log('Form Valid:', this.userProfileForm.valid);
        console.log('Password Errors:', this.userProfileForm.get('password')?.errors);
        console.log('Retype Password Errors:', this.userProfileForm.get('retype_password')?.errors);
        const formData = new FormData();
        if (this.userProfileForm.valid) {
            const updateUserDTO: UpdateUserDTO = {
                fullname: this.userProfileForm.get('fullname')?.value,
                address: this.userProfileForm.get('address')?.value,
                password: this.userProfileForm.get('password')?.value,
                retype_password: this.userProfileForm.get('retype_password')?.value,
                date_of_birth: this.userProfileForm.get('date_of_birth')?.value,
                // user_avatar: this.userProfileForm.get('avatarFileName')?.value,
            };
            // Chuyển DTO thành JSON string
            formData.append('user', new Blob([JSON.stringify(updateUserDTO)], { type: 'application/json' }));

            // Nếu có file ảnh
            if (this.selectedAvatarFile) {
                formData.append('avatar', this.selectedAvatarFile);
            }
            this.userService.updateUserDetail(this.token, formData).subscribe({
                next: (response: any) => {
                    // this.userService.removeUserFromLocalStorage();
                    // this.tokenService.removeToken();
                    this.router.navigate(['/user-profile']);
                    console.log('>>>>>', response);
                    this.userResponse = {
                        ...response,
                        date_of_birth: new Date(response.date_of_birth),
                        user_avatar: `${environment.apiBaseUrl}/avatars/${response.user_avatar}`,
                    };
                    this.userService.saveUserResponseToLocalStorage(this.userResponse!);
                    this.userService.setUser(this.userResponse!); // ✅ cập nhật signal
                    this.toastService.showSuccess('User profile updated successfully');
                },
                error: (error: any) => {
                    console.log('error', error);
                    this.toastService.showError('Error updating user profile: ' + error);
                },
            });
        } else {
            if (this.userProfileForm.hasError('passwordMismatch')) {
                this.toastService.showError('Password and Retype Password do not match');
            }
        }
    }
}
