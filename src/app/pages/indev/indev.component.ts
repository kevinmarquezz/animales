import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-indev',
  templateUrl: './indev.component.html',
  styleUrl: './indev.component.scss'
})
export class IndevComponent {
  constructor(private http: HttpClient, private router: Router) {}

  toHome() {
    this.router.navigateByUrl('/inicio')
  }
}
