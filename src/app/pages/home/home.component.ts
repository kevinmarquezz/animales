import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  slides = [
    {
      image: 'path-to-image1.jpg',
      alt: 'Slide 1',
      name: 'Candy',
      details: 'Mediano | Hembra | Cachorro',
    },
    {
      image: 'path-to-image2.jpg',
      alt: 'Slide 2',
      name: 'Max',
      details: 'Grande | Macho | Adulto',
    },
    // Añade más objetos como este
  ];

  currentSlide = 0;
  intervalId: any;

  ngOnInit() {
    
  }

  main(): void {
    localStorage.clear()
  }
}
