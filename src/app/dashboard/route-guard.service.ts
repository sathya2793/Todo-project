import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService  implements CanActivate {
  public authToken: string;

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.authToken = Cookie.get('authToken');
    if (this.authToken  === undefined || this.authToken  === '' || this.authToken  === null) {
        this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }

  }

}