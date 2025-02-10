import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';

import { AuthLogIn, User } from './authenticate.interface';
import { environment }  from '../../environments/environment.development';
import { DateTime } from 'luxon';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  private tokenExpirationTimer: any;
  
  constructor(private httpClient: HttpClient, private router: Router) {
  }

  public postUser = (user: AuthLogIn): Observable<AuthLogIn> => {
    return this.httpClient.post<AuthLogIn>(`${environment.apiUrl}/api/authenticate/register`, user, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AuthLogIn>) => {
        return response.body!;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  };

  public postLogIn = (loginForm: AuthLogIn): Observable<any> => {
    return this.httpClient.post<AuthLogIn>(`${environment.apiUrl}/api/authenticate/login`, loginForm, { observe: 'response' }).pipe(
      tap((response: HttpResponse<AuthLogIn>) => {
        const { 
          name = '', 
          surname = '', 
          jwtToken = '', 
          expiresIn = 0,
        } = response.body!;
        this.handleAuthentication(name, surname, jwtToken,  expiresIn);
        localStorage.setItem('userInfo', JSON.stringify(response.body));
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  };

  public handleAuthentication = (
    name: string, 
    surname: string,
    jwtToken: string,
    expiresIn: number,
  ) => {
    const expirationDate = DateTime.fromMillis(expiresIn);
    const user = new User(name, surname, jwtToken, expirationDate);
    this.user.next(user);
    // this.autoLogOut(expiresIn);
    localStorage.setItem('authData', JSON.stringify(user));
  };

  public autoLogin = (): void => {
    const userData: {
      name: string, 
      surname: string,
    _token: string,
    _tokenExpirationDate: DateTime,
    } = JSON.parse(localStorage.getItem('authData')!);
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.name, 
      userData.surname, 
      userData._token, 
      userData._tokenExpirationDate,
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDifference = DateTime.fromISO(userData._tokenExpirationDate.toLocaleString()).diff(DateTime.now()).toMillis();
      // this.autoLogOut(expirationDifference);
    }
  }

  public postLogOut = (): void => {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('authData');
    localStorage.removeItem('userInfo');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  };

  public autoLogOut = (expirationDuration: number): void => {
    this.tokenExpirationTimer = setTimeout(() => {
      this.postLogOut();
    }, expirationDuration);
  }
}