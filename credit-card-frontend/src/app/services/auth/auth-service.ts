import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private client = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  token = signal<string | null>(null);
  isAuthenticated = signal(false);

  login(prefix: string) {
    const credentials = {
      username: `${prefix}@bank.dk`,
      password: '1234'
    };

    return this.client.post(`${this.baseUrl}/api/login`, credentials, {
      responseType: 'text'
    }).pipe(
      tap((token: string) => {
        this.token.set(token);
        this.isAuthenticated.set(true);
        localStorage.setItem('token', token);
      })
    );
  }


  logout() {
    this.token.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('token');
  }

  loadToken() {
    const stored = localStorage.getItem('token');
    if (stored) {
      this.validateToken(stored).subscribe({
        next: (isValid) => {
          if (isValid) {
            this.token.set(stored);
            this.isAuthenticated.set(true);
          } else {
            this.logout();
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  private validateToken(token: string) {
    return this.client.get(`${this.baseUrl}/api/checkJWT`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text'
    }).pipe(
      tap(() => console.log('Token is valid')),
      catchError(() => {
        console.log('Token validation failed');
        return of(false);
      })
    );
  }
}
