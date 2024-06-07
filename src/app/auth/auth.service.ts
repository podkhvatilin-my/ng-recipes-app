import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const API_KEY = 'AIzaSyC5W9nM6XzfX8IzBH2dfSEgWqVvSj7zNm0';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimerId: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn);
        })
      );
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      return;
    }

    const parsedUserData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(userData);
    const loadedUser = new User(
      parsedUserData.email,
      parsedUserData.id,
      parsedUserData._token,
      new Date(parsedUserData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      const expirationDuration = new Date(parsedUserData._tokenExpirationDate).getTime() - new Date().getTime();

      this.user.next(loadedUser);
      this.autoLogOut(expirationDuration);
    }
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap((res) => {
        this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn);
      })
    );
  }

  logOut() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);

    if (this.tokenExpirationTimerId) {
      clearTimeout(this.tokenExpirationTimerId);
    }

    this.tokenExpirationTimerId = undefined;
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimerId = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    this.autoLogOut(+expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid login credential.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator.';
        break;
    }

    return throwError(errorMessage);
  }
}
