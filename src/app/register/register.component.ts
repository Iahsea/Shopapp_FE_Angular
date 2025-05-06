import { Component, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FooterComponent, FormsModule, NgIf, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  phone: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  phoneTouched = false;
  passwordTouched = false;


  constructor(private http: HttpClient, private router: Router) {
    this.phone = "894872347";
    this.password = "123456";
    this.retypePassword = "123456";
    this.fullName = "nguyen van test";
    this.address = "dc 123";
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }

  register() {
    const message = `${this.phone} + ${this.password} + ${this.retypePassword}
                      ${this.fullName} + ${this.address} + ${this.isAccepted} + ${this.dateOfBirth}`
    alert(message);

    const apiUrl = "http://localhost:8088/api/v1/users/register"

    const registerData = {
      "fullname": this.fullName,
      "phone_number": this.phone,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(apiUrl, registerData, { headers })
      .subscribe({
        next: (response: any) => {
          debugger
          this.router.navigate(['/login'])
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          alert(`Cannot register, error: ${error.error}`)
          debugger


        }
      });
  }

  //how to check password match ?
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Điều chỉnh tuổi nếu chưa tới sinh nhật trong năm nay
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({ invalidAge: true });
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }


}
