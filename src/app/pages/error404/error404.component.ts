import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.scss'
})
export class Error404Component {
  constructor(private http: HttpClient, private router: Router) {}

  toHome() {
    this.router.navigateByUrl('/')
  }
  
}
