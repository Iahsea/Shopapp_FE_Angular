import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../environments/environment';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiRegister = `${environment.apiBaseUrl}/users/register`;
    private apiLogin = `${environment.apiBaseUrl}/users/login`;
    private apiUserDetail = `${environment.apiBaseUrl}/users/details`;

    private apiConfig = {
        headers: this.createHeaders(),
    };

    private _userResponse = signal<UserResponse | null>(null);

  // Getter cho signal
  readonly userResponse = this._userResponse;

  // Setter
  setUser(user: UserResponse) {
    this._userResponse.set(user);
  }

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    register(registerDTO: RegisterDTO): Observable<any> {
        return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
    }

    login(loginDTO: LoginDTO): Observable<any> {
        return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
    }

    getUserDetail(token: string) {
        return this.http.post(this.apiUserDetail, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }),
        });
    }

    updateUserDetail(token: string, formData: FormData): Observable<any> {
        debugger;
        let userResponse = this.getUserResponseFromStorage();

        return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, formData, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
            withCredentials: false, // thử bật hoặc tắt tùy server bạn
        });
    }

    saveUserResponseToLocalStorage(userResponse?: UserResponse) {
        if (isPlatformBrowser(this.platformId)) {
            try {
                debugger;
                if (userResponse == null || !userResponse) {
                    return;
                }
                // Convert the userResponse object to a JSON string
                const userResponseJSON = JSON.stringify(userResponse);
                // Save the JSON string to local storage with a key (e.g., "userResponse")
                localStorage.setItem('user', userResponseJSON);
                console.log('User response saved to local storage.');
            } catch (error) {
                console.log('Error saving user response to local storage:', error);
            }
        }
    }

    private getUserResponseFromStorage(): UserResponse | null {
        let userResponse = this.getUserResponseFromLocalStorage();

        if (userResponse) {
            return userResponse;
        }

        userResponse = this.getUserResponseFromSessionStorage();
        return userResponse;
    }

    getUserResponseFromLocalStorage(): UserResponse | null {
        if (isPlatformBrowser(this.platformId)) {
            try {
                // Retrieve the JSON string from local storage using the key
                const userResponseJSON = localStorage.getItem('user');
                console.log('>>>>> check userResponseJSON', userResponseJSON);
                if (userResponseJSON == null || userResponseJSON == undefined) {
                    return null;
                }
                // Parse the JSON string back to an object
                const userResponse = JSON.parse(userResponseJSON!);
                console.log('User response retrieved from local storage.');
                return userResponse;
            } catch (error) {
                console.error('Error retrieving user response from local storage:', error);
                return null; // Return null or handle the error as needed
            }
        }
        return null;
    }

    removeUserFromLocalStorage(): void {
        if (isPlatformBrowser(this.platformId)) {
            try {
                localStorage.removeItem('user');
                console.log('User data removed from local storage');
            } catch (error) {
                console.log('Error removing user data from local storage', error);
            }
        }
    }

    getUserResponseFromSessionStorage(): UserResponse | null {
        if (isPlatformBrowser(this.platformId)) {
            try {
                const userResponseJSON = sessionStorage.getItem('user');

                if (userResponseJSON == null) {
                    return null;
                }

                return JSON.parse(userResponseJSON);
            } catch (error) {
                console.log('Error retrieving user response from session storage:', error);
                return null;
            }
        }
        return null;
    }

    saveUserResponseToSessionStorage(userResponse?: UserResponse) {
        if (isPlatformBrowser(this.platformId)) {
            try {
                debugger;
                if (userResponse == null || !userResponse) {
                    return;
                }
                // Convert the userResponse object to a JSON string
                const userResponseJSON = JSON.stringify(userResponse);
                // Save the JSON string to local storage with a key (e.g., "userResponse")
                sessionStorage.setItem('user', userResponseJSON);
                console.log('User response saved to session storage.');
            } catch (error) {
                console.log('Error saving user response to session storage:', error);
            }
        }
    }

    removeUserFromSessionStorage(): void {
        try {
            sessionStorage.removeItem('user');
            console.log('User data removed from session storage');
        } catch (error) {
            console.log('Error removing user data from session storage', error);
        }
    }
}
