import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../app.store';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private http = inject(HttpClient);
  user = signal<User | null>(null);

  async login(email: string, password: string) {

    let url = "/api/users/authenticate";

    const login_data = {
      username: email,
      password: password
    }

    await this.http.post<User>(url, login_data).subscribe(async (data) => {
      console.log(data);
      this.user.set({
        userId: data.userId,
        username: data.username,
        joined: data.joined
      });

      localStorage.setItem('user', JSON.stringify(this.user()));
    });

  }

  async logout(accessToken:  string | undefined) {
    this.user.set(null)
    localStorage.removeItem('user');
    return
  }

  checkLocalStorage() {
    const userAsString = localStorage.getItem('user');

    if (userAsString) {
      try {
        let userParsed = JSON.parse(userAsString) as User;

        if (userParsed) {
          this.user.set({
              userId: userParsed.userId,
              username: userParsed.username,
              joined: userParsed.joined,
            });
        }

      } catch (error) {
        console.log("Error parsing user")
      }
    }
  }

  constructor() {
    this.checkLocalStorage();
  }
}
