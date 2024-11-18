import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private userService: UserService , private http: HttpClient, private router: Router) {}

  formData: any = {
    email: '',
    password: '',
  }
  
  async onSubmit() {
    try {
      if (!this.formData.email || !this.formData.password) {
        console.error('Todos los campos son obligatorios.')
      } else {

        let formDataFiltered = {
          email: this.formData.email,
          password: this.formData.password,
        }
         
        const response = await this.http.post<any>('http://localhost:3000/login', formDataFiltered).toPromise();

        if (response && response.user) {
          localStorage.setItem("infoLogueado", "true");
          localStorage.setItem('userId', response.user.id);
          this.userService.setToken(response.user.id)
          console.log(response.user)
          this.router.navigateByUrl('/')

        } else {
          console.error('error que no tendría que pasar')
        }
      }

    } catch (error: any) {
      console.log(error.error.error)
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
