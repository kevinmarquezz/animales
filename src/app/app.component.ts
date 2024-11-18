import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'animales';

  route: any;

  constructor(private router: Router){
    router.events.subscribe((val) => {
      this.route = this.router.url;
    });
  }

  ngOnInit(): void {

  }

}
