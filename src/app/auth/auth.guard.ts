import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean  {
    return this.authService.user.pipe(
      take(1),
      map((user) => !!user),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/auth']); // or createUrlTree on higher version in map operator
        }
      })
    );
  }
}
