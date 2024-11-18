import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface User {
  id: number,
  email: string,
  password: string,
  name: string,
  profilePhoto: string,
  phone: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] 
})

export class RegisterComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  formData: any = {
    id: 0,
    email: '',
    password: '',
    name: '',
    profilePhoto: 'https://w7.pngwing.com/pngs/142/1021/png-transparent-cat-computer-icons-user-profile-avatar-profile-mammal-animals-cat-like-mammal.png',
    phone: ''
  }

  async onSubmit() {

    if (!this.formData.email || !this.formData.password || !this.formData.name) {
      console.log('Todos los valores son obligatorios.')
    } else {
      
      let formDataFiltered = {
        email: this.formData.email,
        name: this.capitalizeStrings(this.formData.name),
        password: this.formData.password,
        phone: this.formData.phone
      }
       
      console.log(this.formData)
      const response = await this.http.post<any>('http://localhost:3000/register', formDataFiltered).toPromise();

      if (response) {
        this.router.navigateByUrl('/inicio-sesion')
      } else {
        console.error('error que no tendría que pasar')
      }

    }
  }

  ngOnInit(): void {
    
  }

  capitalizeStrings( val: string ) {
  
    return val.toLowerCase()
              .trim()
              .split(' ')
              .map( v => v[0].toUpperCase() + v.substr(1) )
              .join(' ');  
  }

}
