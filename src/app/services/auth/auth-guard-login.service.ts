import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../user/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardLoginService implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) { }
  
  canActivate() {

    if (this.tokenService.getToken() === null) {
      localStorage.removeItem("infoLogueado");
      return true;
    } else {
      localStorage.setItem("infoLogueado", "true");
      this.router.navigate(['']);
      return false;
    }
  }

}
