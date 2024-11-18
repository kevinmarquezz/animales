import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getToken(){
    return localStorage.getItem('token')
  }

  setToken(token: any) {
    localStorage.setItem('token', token)
  }

}
