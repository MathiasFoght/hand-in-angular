import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AuthService } from './services/auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Credit Card Management System');
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.loadToken();
  }
}
