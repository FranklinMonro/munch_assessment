import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { take, exhaustMap } from 'rxjs';
import { AuthService } from './authenticate.service';

const authService: AuthService = inject(AuthService);

export const authenticateInterceptor: HttpInterceptorFn = (req, next) => {
      return authService.user.pipe(
        take(1),
        exhaustMap((user) => {
          if (!user) {
            return next(req);
          }
          const modifiedRequest = req.clone({
            headers: new HttpHeaders().set('X-Authorization', user?.token!),
          });
          return next(modifiedRequest);
        }),
    );
};