import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return localStorage.getItem('token')
  }

  setToken(token: any) {
    localStorage.setItem('token', token)
  }

  getUserData(id: any): Promise<any> {
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<any>(`http://localhost:3000/user/${id}`, { headers }).toPromise();

  }

}
